import {
  Animated,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { styles } from "./styles";
import { Canvas, Rect, Group } from "@shopify/react-native-skia";
import {
  CAR_HEIGHT,
  CAR_WIDTH,
  height,
  INITIAL_SPEED,
  LANE_CENTERS,
  LANE_WIDTH,
  MIN_SPAWN_INTERVAL,
  Obstacle,
  OBSTACLE_HEIGHT,
  obstacleImages,
  ROAD_LINE_GAP,
  ROAD_LINE_HEIGHT,
  RoadLine,
  SPEED_INCREMENT,
  width,
} from "./Constant";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const CarGameWithSkia = () => {
  const [roadLine, setRoadLine] = useState<RoadLine[]>([]);
  const playerX = useSharedValue(LANE_CENTERS[1]);
  const lastSpawnTime = useSharedValue(0);
  const [score, setScore] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(INITIAL_SPEED);
  const playerY = height - CAR_HEIGHT - 20;

  useEffect(() => {
    const totalLines = Math.ceil(height / (ROAD_LINE_HEIGHT + ROAD_LINE_GAP)) + 1;
    const lines: RoadLine[] = Array.from({ length: totalLines }, (_, i) => ({
      id: `line-${i}`,
      y: i * (ROAD_LINE_HEIGHT + ROAD_LINE_GAP) - ROAD_LINE_HEIGHT,
    }));
    setRoadLine(lines);
  }, []);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      console.log("Pan X:", e.translationX);
      const currentLane = Math.round(playerX.value / LANE_WIDTH);
      const targetLane = Math.max(
        0,
        Math.min(2, Math.round((playerX.value + e.translationX) / LANE_WIDTH))
      );

      if (currentLane !== targetLane) {
        playerX.value = withSpring(LANE_CENTERS[targetLane], {
          damping: 20,
          stiffness: 200,
        });
      }
    })
    .activeOffsetX([-10, 10]);

  const playerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: playerX.value }],
  }));

  const getSafeLanes = useCallback(() => {
    const dangerZone = height / 2;
    const occupiedLanes = new Set(
      obstacles.filter((obs) => obs.y < dangerZone).map((obs) => obs.lane)
    );

    return [0, 1, 2].filter((lane) => {
      if (occupiedLanes.has(lane)) return false;

      const left = lane - 1;
      const right = lane + 1;

      const adjacentBlocked =
        left >= 0 &&
        occupiedLanes.has(left) &&
        right <= 2 &&
        occupiedLanes.has(right);

      return !adjacentBlocked;
    });
  }, [obstacles]);

  const spawnObstacle = useCallback(() => {
    const now = Date.now();
    if (now - lastSpawnTime.value < MIN_SPAWN_INTERVAL) return;

    const safeLanes = getSafeLanes();
    if (safeLanes.length === 0) return;

    const lane = safeLanes[Math.floor(Math.random() * safeLanes.length)];
    const speed = gameSpeed + Math.random() * 0.5;
    const image = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];

    setObstacles((prev) => [
      ...prev,
      {
        id: `obs-${now}`,
        x: LANE_CENTERS[lane],
        y: -OBSTACLE_HEIGHT,
        speed,
        lane,
        image,
      },
    ]);
    lastSpawnTime.value = now;
  }, [gameSpeed, getSafeLanes]);

  useEffect(() => {
    if (gameOver) return;
    const gameLoop = setInterval(() => {
      setGameSpeed((prev) => Math.min(prev + SPEED_INCREMENT / 100, 8));

      setRoadLine((prev) =>
        prev.map((line) => {
          const newY = line.y + gameSpeed;
          return {
            ...line,
            y: newY >= height ? -ROAD_LINE_HEIGHT : newY,
          };
        })
      );

      const shouldSpawn = Math.random() < Math.min(0.05 + score / 2000, 0.15);
      if (shouldSpawn) spawnObstacle();

      setObstacles((prev) => {
        return prev
          .map((obs) => {
            const newY = obs.y + obs.speed;
            const carOverlap =
              newY + INITIAL_SPEED > playerY && newY < playerY + CAR_HEIGHT;
            const laneOverlap = Math.abs(obs.x - playerX.value) < CAR_WIDTH * 0.9;

            if (carOverlap && laneOverlap) {
              setGameOver(true);
            }

            return { ...obs, y: newY };
          })
          .filter((obs) => {
            if (obs.y > height) {
              setScore((prev) => prev + 1);
              return false;
            }
            return true;
          });
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameOver, gameSpeed, spawnObstacle]);

  const resetGame = () => {
    setGameOver(false);
    setScore(0);
    setGameSpeed(INITIAL_SPEED);
    playerX.value = LANE_CENTERS[1];
    setObstacles([]);
    lastSpawnTime.value = 0;
  };

  return (
 
 
    <GestureHandlerRootView>
      <View style={styles.constainer}>
        <Canvas style={styles.canvas}>
          <Rect x={0} y={0} width={width} height={height} color="#333" />
          <Group>
            {roadLine?.map((line) => (
              <React.Fragment key={line.id}>
                <Rect
                  x={LANE_WIDTH - 5}
                  y={line.y}
                  width={10}
                  height={ROAD_LINE_HEIGHT}
                  color="white"
                />
                <Rect
                  x={LANE_WIDTH * 2 - 5}
                  y={line.y}
                  width={10}
                  height={ROAD_LINE_HEIGHT}
                  color="white"
                />
              </React.Fragment>
            ))}
          </Group>
        </Canvas>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.playerCar,
              playerStyle,
              { bottom: 20, width: CAR_WIDTH, height: CAR_HEIGHT },
            ]}
          >
            <Image
              source={require("../car/Car5.png")}
              style={{
                width: CAR_WIDTH,
                height: CAR_HEIGHT,
                resizeMode: "contain",
              }}
            />
          </Animated.View>
        </GestureDetector>

        <View style={styles.scoreDisplay}>
          <Text style={styles.currentScore}>Score: {score}</Text>
          <Text style={styles.speedText}>Speed: {gameSpeed.toFixed(1)}x</Text>
        </View>

        {gameOver && (
          <View style={styles.gameOver}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
              <Text style={styles.restartText}>Restart</Text>
            </TouchableOpacity>
          </View>
        )}

        {obstacles.map((obs) => (
          <Image
            key={obs.id}
            source={obs.image}
            style={{
              position: "absolute",
              left: obs.x,
              zIndex: 1,
              top: obs.y,
              width: CAR_WIDTH,
              height: CAR_HEIGHT,
              resizeMode: "contain",
            }}
          />
        ))}
      </View>
    </GestureHandlerRootView>
   
  );
};

export default CarGameWithSkia;
