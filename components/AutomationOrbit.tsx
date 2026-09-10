"use client";

import { useRef, type PointerEvent } from "react";

const orbitNodes = [
  ["RHEL", "orbit-node node-rhel"],
  ["Linux", "orbit-node node-linux"],
  ["Cloud", "orbit-node node-cloud"],
  ["GitHub", "orbit-node node-github"],
  ["K8s", "orbit-node node-k8s"],
];

export default function AutomationOrbit() {
  const sceneRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
    const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8;
    sceneRef.current?.style.setProperty("--orbit-x", `${rotateX.toFixed(2)}deg`);
    sceneRef.current?.style.setProperty("--orbit-y", `${rotateY.toFixed(2)}deg`);
  };

  const resetScene = () => {
    sceneRef.current?.style.setProperty("--orbit-x", "0deg");
    sceneRef.current?.style.setProperty("--orbit-y", "0deg");
  };

  return (
    <div
      className="automation-orbit relative isolate min-h-[430px] overflow-hidden rounded-[2rem] border border-white/10"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetScene}
      ref={sceneRef}
      role="img"
      aria-label="Interactive automation topology connecting Ansible with RHEL, Linux, cloud, GitHub, and Kubernetes"
    >
      <div className="orbit-grid" aria-hidden="true" />
      <div className="orbit-scene" aria-hidden="true">
        <div className="orbit-ring orbit-ring-one" />
        <div className="orbit-ring orbit-ring-two" />
        <div className="orbit-ring orbit-ring-three" />
        <div className="orbit-core"><span>ANSIBLE</span><small>AUTOMATION</small></div>
        {orbitNodes.map(([label, className]) => <div className={className} key={label}>{label}</div>)}
      </div>
      <div className="orbit-status" aria-hidden="true">
        <span><i /> LAB SYSTEM ONLINE</span>
        <code>verified workflows / practical outcomes</code>
      </div>
      <div className="orbit-coordinate orbit-coordinate-top" aria-hidden="true">43.6532° N</div>
      <div className="orbit-coordinate orbit-coordinate-bottom" aria-hidden="true">RAJAT / APPLIED TECHNOLOGY</div>
    </div>
  );
}
