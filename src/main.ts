import { initGfx, setDrawables } from "./gfx.js";
import { generatePoints } from "./data.js";

function main(){
  initGfx();

  const points = generatePoints(50);
  setDrawables(points);
}

window.onload=main; //last line in the file, main function is initial