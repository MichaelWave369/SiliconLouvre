import * as THREE from 'three';

/**
 * Low-draw-call, deterministic procedural sculpture renderer.
 * Instanced geometry holds the rhythm of each curated interpretation.
 * The source paintings remain separate, unmodified flat images.
 */
export function mountRealmSculptures(parent, blueprint) {
  if (!parent || !blueprint) throw new TypeError('Realm group and blueprint required');
  const geometryFor = {
    box: () => new THREE.BoxGeometry(1, 1, 1),
    sphere: () => new THREE.SphereGeometry(.5, 10, 8),
    octahedron: () => new THREE.OctahedronGeometry(.7),
    tetrahedron: () => new THREE.TetrahedronGeometry(.7),
    cone: () => new THREE.ConeGeometry(.5, 1.3, 5),
  };
  const transform = new THREE.Object3D();
  const rotations = [];
  for (const batch of blueprint.batches) {
    const make = geometryFor[batch.shape];
    if (!make || batch.instances.length > 400) throw new Error('Unapproved XR geometry batch');
    const mesh = new THREE.InstancedMesh(
      make(),
      new THREE.MeshStandardMaterial({
        color: batch.color, metalness: .3, roughness: .42,
        emissive: batch.color, emissiveIntensity: .075,
      }),
      batch.instances.length,
    );
    mesh.name = 'Louvre ' + blueprint.motif + ' / ' + batch.shape;
    for (let i = 0; i < batch.instances.length; i++) {
      const item = batch.instances[i];
      transform.position.set(...item.position);
      transform.rotation.set(...item.rotation);
      transform.scale.set(...item.scale);
      transform.updateMatrix();
      mesh.setMatrixAt(i, transform.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    parent.add(mesh);
  }
  for (const ring of blueprint.hoops) {
    const hoop = new THREE.Mesh(
      new THREE.TorusGeometry(ring.radius, .042, 5, 64),
      new THREE.MeshBasicMaterial({
        color: ring.color, side: THREE.DoubleSide,
        transparent: true, opacity: .78, depthWrite: false,
      }),
    );
    hoop.name = 'Louvre ' + blueprint.motif + ' / orbital hoop';
    hoop.position.set(...ring.position);
    hoop.userData.spinSpeed = ring.speed;
    parent.add(hoop);
    if (ring.speed !== 0) rotations.push(hoop);
  }
  return { rotating: rotations };
}
