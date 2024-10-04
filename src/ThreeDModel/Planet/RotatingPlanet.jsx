import { useFrame, useLoader } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { TextureLoader } from "three";

export default function RotatingPlanet({
  color,
  name,
  speed,
  position: initialPosition,
  size,
  photo,
  ...props
}) {
  function Rotating() {
    const [position, setPosition] = useState(initialPosition);
    const myMesh = useRef();
    const ringsRef = useRef();

    useEffect(() => {
      console.log("Planet name:", name);
      console.log("Is Saturn?", name.toLowerCase() === "saturn");
    }, [name]);

    useFrame(({ clock }) => {
      const a = clock.getElapsedTime();
      myMesh.current.rotation.y = a;
      myMesh.current.rotation.x = 4.5;
      const newValue = initialPosition + (a * speed) / 50;
      const newPosition = [
        initialPosition * Math.cos(newValue),
        initialPosition * Math.sin(newValue),
        0,
      ];
      setPosition(newPosition);
      
      if (ringsRef.current) {
        ringsRef.current.position.set(...newPosition);
        ringsRef.current.rotation.x = -Math.PI / 2;
      }
    });

    const texture = useLoader(TextureLoader, photo);

    const isSaturn = name.toLowerCase() === "saturn";

    return (
      <>
        <mesh
          {...props}
          receiveShadow
          castShadow
          ref={myMesh}
          position={position}
        >
          <sphereGeometry args={[size, 30, 30]} />
          <meshPhysicalMaterial map={texture} />
        </mesh>
        
        {isSaturn && (
          <mesh ref={ringsRef} position={position}>
            <ringGeometry args={[size * 1.2, size * 1.8, 64]} />
            <meshStandardMaterial color="#C7A67780" side={2} transparent opacity={0.7} />
          </mesh>
        )}
      </>
    );
  }

  return <Rotating />;
}
