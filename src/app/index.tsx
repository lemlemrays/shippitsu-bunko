import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PAGES = [
  require("../../assets/images/sample.jpg"),
  require("../../assets/images/sample.jpg"),
  require("../../assets/images/sample.jpg"),
];

const { width: SW, height: SH } = Dimensions.get("window");

export default function HomeScreen() {
  const [pageIndex, setPageIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const goTo = (next: number, direction: "left" | "right") => {
    if (next < 0 || next >= PAGES.length) return;
    const toValue = direction === "left" ? -SW : SW;
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: direction === "left" ? SW : -SW,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setPageIndex(next);
      setScale(1);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20,
      onPanResponderRelease: (_, g) => {
        if (g.dx < -50) goTo(pageIndex + 1, "left");
        else if (g.dx > 50) goTo(pageIndex - 1, "right");
      },
    })
  ).current;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 直筆文庫</Text>
        <Text style={styles.pager}>
          {pageIndex + 1} / {PAGES.length}
        </Text>
      </View>

      <View style={styles.viewer} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.pageWrap,
            { transform: [{ translateX: slideAnim }, { scale }] },
          ]}
        >
          <Image
            source={PAGES[pageIndex]}
            style={styles.page}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <View style={styles.zoomBar}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => setScale((s) => Math.max(0.5, s - 0.25))}
        >
          <Text style={styles.btnText}>－</Text>
        </TouchableOpacity>
        <Text style={styles.zoomLabel}>{Math.round(scale * 100)}%</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => setScale((s) => Math.min(4, s + 0.25))}
        >
          <Text style={styles.btnText}>＋</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navBtn, pageIndex === 0 && styles.disabled]}
          onPress={() => goTo(pageIndex - 1, "right")}
        >
          <Text style={styles.navText}>◀ 前のページ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, pageIndex === PAGES.length - 1 && styles.disabled]}
          onPress={() => goTo(pageIndex + 1, "left")}
        >
          <Text style={styles.navText}>次のページ ▶</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#2c2416",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f0e6c8",
  },
  pager: {
    fontSize: 14,
    color: "#a09070",
  },
  viewer: {
    flex: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  pageWrap: {
    width: SW * 0.92,
    height: SH * 0.72,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  page: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  zoomBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingVertical: 10,
  },
  btn: {
    backgroundColor: "#5c4a2a",
    borderRadius: 20,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#f0e6c8",
    fontSize: 22,
  },
  zoomLabel: {
    color: "#a09070",
    fontSize: 14,
    width: 48,
    textAlign: "center",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 4,
  },
  navBtn: {
    backgroundColor: "#5c4a2a",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.3,
  },
  navText: {
    color: "#f0e6c8",
    fontSize: 15,
  },
});