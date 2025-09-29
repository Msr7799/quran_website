// تعريف أنواع Three.js لـ React Three Fiber
import { Object3DNode } from '@react-three/fiber';
import { DirectionalLight, PointLight, Group, Mesh, MeshStandardMaterial } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      directionalLight: Object3DNode<DirectionalLight, typeof DirectionalLight>;
      pointLight: Object3DNode<PointLight, typeof PointLight>;
      group: Object3DNode<Group, typeof Group>;
      mesh: Object3DNode<Mesh, typeof Mesh>;
      meshStandardMaterial: Object3DNode<MeshStandardMaterial, typeof MeshStandardMaterial>;
    }
  }
}
