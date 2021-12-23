import VisualObject from './abstract'
import {m4, primitives, createTexture} from '../../lib/twgl-full'
import '../../lib/lodash'


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

    uniform mat4 u_ligth_transform;
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
        v_position = u_worldViewProjection * u_transform * position;
        v_normal = (u_worldInverseTranspose * vec4(normal, 0)).xyz;
        v_surfaceToLight = u_lightWorldPos - (u_ligth_transform * position).xyz;
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

    static divs = 20;

    constructor(gl, radius, texturePath, vParent ) {
        super(gl, vParent)
        this.bufferInfo = primitives.createSphereBufferInfo(gl, radius, Planet.divs, Planet.divs)

        this.uniforms.u_diffuse  = createTexture(gl, {
            min: gl.NEAREST,
            mag: gl.NEAREST,
            target: gl.TEXTURE_2D_ARRAY,
            src: texturePath,
        })
    }

    update(time) {
        super.update()

        const totalTrans = _.concat(this.transforms, _.filter(this.vParent.transforms, { isPriv: false } ))

        this.uniforms.u_transform = _.reduceRight(totalTrans, (acc, t) => m4.multiply(acc, t.f(time)), m4.identity())        
        this.uniforms.u_ligth_transform = _.reduce(totalTrans, (acc, t) => m4.multiply(acc, t.f(-time)), m4.identity())
    }
    
    render(gl, changeProg) {
        super.render(gl, changeProg)
    }
}

export default Planet