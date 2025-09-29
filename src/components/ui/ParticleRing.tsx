import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { pointsInner, pointsOuter, createPointsWithColors } from "./utils/utils";
import { Group } from "three";

const ParticleRing = ({ 
  leftColor = "ffffff", 
  rightColor = "cccccc", 
  useCustomColors = true 
}: { 
  leftColor?: string; 
  rightColor?: string; 
  useCustomColors?: boolean;
}) => {
  const [colorControls, setColorControls] = useState({
    leftColor,
    rightColor,
    showControls: false
  });

  // إنشاء النقاط مع الألوان المخصصة - ربطها بـ colorControls
  const customPoints = useMemo(() => {
    if (useCustomColors) {
      return createPointsWithColors(colorControls.leftColor, colorControls.rightColor);
    }
    return { innerPoints: pointsInner, outerPoints: pointsOuter };
  }, [colorControls.leftColor, colorControls.rightColor, useCustomColors]);
  return (
    <div className="relative">
      {/* إضافة خلفية GIF */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: 'url(/alf.gif)',
          zIndex: 1
        }}
      />
      
      <Canvas
        camera={{
          position: [10, -7.5, -5],
        }}
        style={{ height: "100vh", position: "relative", zIndex: 2 }}
        className="bg-transparent"
        dpr={[0.8, 1]} // تقليل أكثر للـ pixel ratio
        performance={{ min: 0.3 }} // تحسين أقوى للأداء
        frameloop="demand" // رسم عند الحاجة فقط
        gl={{ 
          antialias: false, // تعطيل antialiasing لتوفير GPU
          alpha: true,
          powerPreference: "low-power" // تفضيل الطاقة المنخفضة
        }}
      >
        <OrbitControls 
          maxDistance={35} 
          minDistance={15} 
          enableDamping={false}
          enablePan={false}
        />
        {/* @ts-expect-error - Three.js JSX element - إضاءة واحدة فقط لتوفير الـ CPU */}
        <ambientLight intensity={0.5} />
        <PointCircle points={customPoints} />
      </Canvas>

      {/* Color Controls */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setColorControls(prev => ({ ...prev, showControls: !prev.showControls }))}
          className="bg-black/50 text-white px-3 py-2 rounded text-sm mb-2"
        >
          .
        </button>
        
        {colorControls.showControls && (
          <div className="bg-black/80 p-4 rounded space-y-2 text-white text-sm">
            <div>
              <label>اللون الأيسر:</label>
              <input
                type="color"
                value={`#${colorControls.leftColor}`}
                onChange={(e) => setColorControls(prev => ({ ...prev, leftColor: e.target.value.slice(1) }))}
                className="ml-2 w-8 h-8"
              />
            </div>
            <div>
              <label>اللون الأيمن:</label>
              <input
                type="color"
                value={`#${colorControls.rightColor}`}
                onChange={(e) => setColorControls(prev => ({ ...prev, rightColor: e.target.value.slice(1) }))}
                className="ml-2 w-8 h-8"
              />
            </div>
            <div className="text-xs opacity-75">
              النجوم: 400 ⭐ (محسّن للأداء العالي)
            </div>
            <div className="flex gap-1 mt-2">
              <button
                onClick={() => setColorControls(prev => ({ 
                  ...prev, 
                  leftColor: "ffffff", 
                  rightColor: "ffd700" 
                }))}
                className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex-1"
              >
                🔄 افتراضي
              </button>
              <button
                onClick={() => setColorControls(prev => ({ 
                  ...prev, 
                  leftColor: "87ceeb", 
                  rightColor: "4169e1" 
                }))}
                className="bg-sky-600 text-white px-2 py-1 rounded text-xs flex-1"
              >
                💙 أزرق
              </button>
              <button
                onClick={() => setColorControls(prev => ({ 
                  ...prev, 
                  leftColor: "ff69b4", 
                  rightColor: "8a2be2" 
                }))}
                className="bg-purple-600 text-white px-2 py-1 rounded text-xs flex-1"
              >
                💜 وردي
              </button>
            </div>
          </div>
        )}
      </div>

      <h1 className="absolute top-[50%] left-[50%] p-2 m-2 -translate-x-[50%] -translate-y-[50%] text-slate-200 font-medium text-2xl md:text-5xl pointer-events-none z-10">
      قال تعالى في سورة الإسراء: إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ 
      </h1>
      <br />

      <h1 className="absolute top-[60%] left-[50%] p-2 m-2 -translate-x-[50%] -translate-y-[50%] text-slate-200 font-medium text-2xl md:text-5xl pointer-events-none z-10">
      وَيُبَشِّرُ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا كَبِيرًا
        </h1>
    </div>
  );
};

const PointCircle = ({ points }: { 
  points: { 
    innerPoints: { idx: number; position: number[]; color: string; }[]; 
    outerPoints: { idx: number; position: number[]; color: string; }[]; 
  } 
}) => {
  const ref = useRef<Group | null>(null);
  const lastUpdateTime = useRef(0);

  // تحسين شديد للـ CPU - تحديث كل 6 frames فقط
  useFrame(({ clock }) => {
    const currentTime = clock.elapsedTime;
    if (ref.current?.rotation && currentTime - lastUpdateTime.current > 0.1) {
      // حركة بطيئة جداً وتحديث متباعد
      ref.current.rotation.z = currentTime * 0.01;
      lastUpdateTime.current = currentTime;
    }
  });

  return (
    // @ts-expect-error - Three.js JSX element
    <group ref={ref}>
      {points.innerPoints.map((point) => (
        <Point key={point.idx} position={point.position} color={point.color} />
      ))}
      {points.outerPoints.map((point) => (
        <Point key={point.idx} position={point.position} color={point.color} />
      ))}
      {/* @ts-expect-error - Three.js JSX element */}
    </group>
  );
};

const Point = React.memo(({ position, color }: { position: number[]; color: string }) => {
  // إضافة تنوع في الدوران لجعل الأشكال المعينة أكثر طبيعية
  const randomRotation = React.useMemo(() => [
    Math.PI / 4 + (Math.random() - 0.5) * 0.5,
    Math.PI / 4 + (Math.random() - 0.5) * 0.5,
    Math.random() * Math.PI
  ], []);

  // تحسين الأداء - التحقق من صحة البيانات
  if (!position || position.length !== 3 || !color) {
    return null;
  }

  return (
    // @ts-expect-error - Three.js JSX element
    <mesh position={position as [number, number, number]} rotation={randomRotation}>
      {/* @ts-expect-error - Three.js geometry JSX - استخدام tetrahedron أبسط من octahedron */}
      <tetrahedronGeometry args={[0.05]} />
      {/* @ts-expect-error - Three.js material JSX */}
      <meshBasicMaterial
        color={color}
        transparent={true}
        opacity={0.8}
      />
      {/* @ts-expect-error - Three.js JSX element */}
    </mesh>
  );
});

Point.displayName = 'Point';

export default ParticleRing;