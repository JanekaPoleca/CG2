import VisualObject from './abstract'
import {m4, resizeCanvasToDisplaySize} from '../../lib/twgl-full'

/**
 * Universe Class
 */
 class Universe extends VisualObject {
    static vs = `
    void main() {
    }`
    static fs = `
    void main() {
    }
    `
    
    constructor(gl) {
        super(gl)
        gl.clearColor(0.1, 0.1, 0.1, 1);

        const fov = 30 * Math.PI / 180;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.5;
        const zFar = 205;
        const projection = m4.perspective(fov, aspect, zNear, zFar);
        const eye = [0, 50, 20];
        const target = [0, 0, 0];
        const up = [0, -1, 0];

        const camera = m4.lookAt(eye, target, up);
        const view = m4.inverse(camera);
        const viewProjection = m4.multiply(projection, view);
        const world = m4.identity();

        this.uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);
        this.uniforms.u_transform = m4.identity();
    }

    
    update() {
        super.update()
    }

    render(gl, time) {
        //super.render(gl, time)
        resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}

export default Universe