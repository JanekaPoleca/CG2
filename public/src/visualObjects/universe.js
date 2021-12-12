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

        this.fov = 30 * Math.PI / 180;
        this.zNear = 0.5;
        this.zFar = 1000;
        this.eye = [0, 200, 400];
        this.target = [0, 0, 0];
        this.up = [0, -1, 0];
        this.world = m4.identity();

        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const projection = m4.perspective(this.fov, aspect, this.zNear, this.zFar);
        

        const camera = m4.lookAt(this.eye, this.target, this.up);
        const view = m4.inverse(camera);
        const viewProjection = m4.multiply(projection, view);
        

        this.uniforms.u_worldViewProjection = m4.multiply(viewProjection, this.world);
        this.uniforms.u_transform = m4.identity();
        this.uniforms.u_lightWorldPos = [0, 0, 0]
        this.uniforms.u_lightColor = [1, 1, 1, 1]
        this.uniforms.u_ambient = [0.05, 0.02, 0.02, 1]
        this.uniforms.u_specular = [0, 0, 0, 1]
        this.uniforms.u_shininess = 50
        this.uniforms.u_specularFactor = 0
        this.uniforms.u_viewInverse = camera
        this.uniforms.u_world = this.world
        this.uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(this.world));
    }

    
    update() {
        super.update()
    }

    render(gl, time) {
        //this.world = m4.rotationZ(time*0.001)
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const projection = m4.perspective(this.fov, aspect, this.zNear, this.zFar);
        const camera = m4.lookAt(this.eye, this.target, this.up);
        const view = m4.inverse(camera);
        const viewProjection = m4.multiply(projection, view);
        
        this.uniforms.u_worldViewProjection = m4.multiply(viewProjection, this.world);
        this.uniforms.u_viewInverse = camera
        this.uniforms.u_world = this.world
        this.uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(this.world));

        //super.render(gl, time)
        resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}

export default Universe