import { App } from "./app";

const canvas = document.getElementById("app-canvas") as HTMLCanvasElement;
const app = new App(canvas);

app.start();