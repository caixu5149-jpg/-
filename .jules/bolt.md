## 2024-12-28 - Material Instancing
**Learning:** Three.js applications often create new Material instances in loops (e.g., `new THREE.MeshStandardMaterial({...})`), leading to massive memory overhead and draw call inefficiency.
**Action:** Always inspect particle/object creation loops. Move invariant material creation *outside* the loop and reuse instances. Verify via `script.js` analysis or by mocking the Three.js classes in a Node script to count instance creation.
