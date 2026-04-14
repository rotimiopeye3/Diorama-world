/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Scene } from './components/canvas/Scene';
import { Overlay } from './components/ui/Overlay';

export default function App() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-950">
      <Scene />
      <Overlay />
    </main>
  );
}

