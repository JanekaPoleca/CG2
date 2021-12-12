import VisualObject from './abstract'
import {m4, primitives, createTexture} from '../../lib/twgl-full'


/**
 * Planet Class
 */
 class Planet extends VisualObject {
    static vs = `
    uniform mat4 u_worldViewProjection;
    uniform vec3 u_lightWorldPos;
    uniform mat4 u_world;
    uniform mat4 u_viewInverse;
    uniform mat4 u_worldInverseTranspose;

    uniform mat4 u_transform;
    uniform mat4 u_spin;
    uniform mat4 u_orbit;

    attribute vec4 position;
    attribute vec3 normal;
    attribute vec2 texcoord;

    varying vec2 v_texCoord;
    varying vec3 v_normal;
    varying vec3 v_surfaceToLight;
    varying vec3 v_surfaceToView;
    varying vec4 v_position;
    
    void main() {
        v_texCoord = texcoord;
        v_position = u_worldViewProjection * (u_spin * position * u_transform * u_orbit);
        v_normal = (u_worldInverseTranspose * vec4(normal, 0)).xyz;
        v_surfaceToLight = u_lightWorldPos - (u_orbit * position * u_transform * u_spin).xyz;
        v_surfaceToView = (u_viewInverse[3] - v_position).xyz;

        gl_Position = v_position;
    }`

    static fs = `
    precision mediump float;

    uniform vec4 u_lightColor;
    uniform vec4 u_ambient;
    uniform sampler2D u_diffuse;
    uniform vec4 u_specular;
    uniform float u_shininess;
    uniform float u_specularFactor;

    varying vec2 v_texCoord;
    varying vec3 v_normal;
    varying vec3 v_surfaceToLight;
    varying vec3 v_surfaceToView;
    varying vec4 v_position;
    
    vec4 lit(float l ,float h, float m) {
      return vec4(1.0,
                  max(l, 0.0),
                  (l > 0.0) ? pow(max(0.0, h), m) : 0.0,
                  1.0);
    }
    
    void main() {
      vec4 diffuseColor = texture2D(u_diffuse, v_texCoord);
      vec3 a_normal = normalize(v_normal);
      vec3 surfaceToLight = normalize(v_surfaceToLight);
      vec3 surfaceToView = normalize(v_surfaceToView);
      vec3 halfVector = normalize(surfaceToLight + surfaceToView);
      vec4 litR = lit(dot(a_normal, surfaceToLight),
                        dot(a_normal, halfVector), u_shininess);
      vec4 outColor = vec4((
      u_lightColor * (diffuseColor * litR.y + diffuseColor * u_ambient +
                    u_specular * litR.z * u_specularFactor)).rgb,
          diffuseColor.a);
      gl_FragColor = outColor;
    }`

    constructor(gl, radius, divs, spinSpeed, orbitSpeed, texturePath, parent ) {
        super(gl, parent)
        this.bufferInfo = primitives.createSphereBufferInfo(gl, radius, divs, divs)

        this.transformations = []

        this.spinMat = time => m4.rotationZ(degreesToRad(spinSpeed)*time)
        this.OrbitMat = time => m4.rotationZ(degreesToRad(orbitSpeed)*time)


        const tex = createTexture(gl, {
            min: gl.NEAREST,
            mag: gl.NEAREST,
            target: gl.TEXTURE_2D_ARRAY,
            src: texturePath,
        });

        this.uniforms.u_diffuse = tex
    }

    update(time) {
        super.update()

        let totalTrans = m4.identity();

        for(var i=this.transformations.length-1; i>=0; i--){
            totalTrans = m4.multiply(this.transformations[i](time), totalTrans)
        }

        this.uniforms.u_spin = this.spinMat(time)
        this.uniforms.u_orbit = this.OrbitMat(time)

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
    
    addEllipseZ(a, b, alpha){
        this.transformations.push( (time) => { return [
            1,0,0,a*Math.cos(alpha*time),
            0,1,0,b*Math.sin(alpha*time),
            0,0,1,0,
            0,0,0,1
        ]});
    }

}

const degreesToRad = deg => {
    return deg*Math.PI/180;  
}

export default Planet