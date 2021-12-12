import VisualObject from './abstract'
import {m4, primitives} from '../../lib/twgl-full'


/**
 * Torus Class
 */
 class Torus extends VisualObject {
    static vs = `
    uniform mat4 u_worldViewProjection;
    uniform mat4 u_transform;
    attribute vec4 position;
    attribute vec3 normal;
    
    varying vec4 norm;
    
    void main() {
        gl_Position = u_worldViewProjection * (position * u_transform);
        norm = vec4(normal, 1);
    }`

    static fs = `
    precision mediump float;
    
    varying vec4 norm;
    
    void main() {
        gl_FragColor = norm * vec4(1, 1, 1, 1);
    }`

    constructor(gl, radius, thickness, radialSub, bodySub, parent) {
        super(gl, parent)
        this.bufferInfo = primitives.createTorusBufferInfo(gl, radius, thickness, radialSub, bodySub)

        this.transformations = []

    }

    update(time) {
        super.update()

        let totalTrans = m4.identity();

        for(var i=this.transformations.length-1; i>=0; i--){
            totalTrans = m4.multiply(this.transformations[i](time), totalTrans)
        }
        
        
        this.uniforms.u_transform = totalTrans
        

    }
    
    render(gl,time) {
        super.render(gl, time)
    }

    addTranslation(x, y, z) {
        this.transformations.push( (time) => { return [
            1,0,0,x,
            0,1,0,y,
            0,0,1,z,
            0,0,0,1
        ]});
    }

    addRotationX(alpha, staticRotation=false){
        this.transformations.push( (time) => { return m4.rotationX(degreesToRad(alpha)* staticRotation ? 1 : time)});
    }

    addRotationY(alpha, staticRotation=false){
        this.transformations.push( (time) => { return m4.rotationY(degreesToRad(alpha)* staticRotation ? 1 : time)});
    }

    addRotationZ(alpha, staticRotation=false){
        this.transformations.push( (time) => { return m4.rotationZ(degreesToRad(alpha)* staticRotation ? 1 : time)});
    }

}

const degreesToRad = deg => {
    return deg*Math.PI/180;  
}

export default Torus