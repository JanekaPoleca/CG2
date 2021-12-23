import VisualObject from './abstract'
import {m4, primitives, createTexture} from '../../lib/twgl-full'
import '../../lib/lodash'


/**
 * Planet Class
 */
 class Planet extends VisualObject {
    static vs = `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 texcoord;

    uniform mat4 u_projection, u_model, u_view, u_normalMat;

    varying vec3 normalInterp;
    varying vec3 vertPos;
    varying vec2 tex;
    
    void main() {
        tex = texcoord;
        vec4 vertPos4 = u_view * (u_model * vec4(position, 1.0));
        vertPos = vertPos4.xyz;
        normalInterp = vec3(u_normalMat * vec4(normal, 0.0));
        gl_Position = u_projection * vertPos4;
    }`

    static fs = `
    precision highp float;

    uniform float u_ka;   // Ambient reflection coefficient
    uniform float u_kd;   // Diffuse reflection coefficient
    uniform float u_ks;   // Specular reflection coefficient

    uniform float u_shininess; 
    
    uniform vec4 u_ambientColor;
    uniform sampler2D u_diffuse;
    uniform vec4 u_specularColor;
    uniform mat4 u_view;
    uniform vec4 u_lightWorldPos; // Light position
    uniform vec4 u_lightColor;

    uniform int u_sun;


    varying vec3 normalInterp;  // Surface normal
    varying vec3 vertPos;       // Vertex position
    varying vec2 tex;

    void main() {

        vec4 diffuseColor = texture2D(u_diffuse, tex);

        vec3 N = normalize(normalInterp);

        vec3 Lpos = (u_view * u_lightWorldPos).xyz;

        vec3 L = normalize( Lpos - vertPos );

        // Lambert's cosine law
        float lambertian = max(dot(N, L), 0.0);
        float specular = 0.0;
        if(lambertian > 0.0) {
            vec3 R = reflect(-L, N);      // Reflected light vector
            vec3 V = normalize(-vertPos); // Vector to viewer
            // Compute the specular term
            float specAngle = max(dot(R, V), 0.0);
            specular = pow(specAngle, u_shininess);
        }

        vec4 ambi = u_ka * u_ambientColor;
        vec4 diff = u_kd * u_lightColor * lambertian * diffuseColor;
        vec4 spec = u_ks * specular * u_specularColor;

        if ( u_sun == 0 ) gl_FragColor = ambi + diff + spec;
        if ( u_sun == 1 ) gl_FragColor = diffuseColor;
    }`

    static divs = 20;

    constructor(gl, radius, texturePath, vParent, isSun = false ) {
        super(gl, vParent)
        this.bufferInfo = primitives.createSphereBufferInfo(gl, radius, Planet.divs, Planet.divs)

        this.uniforms.u_diffuse  = createTexture(gl, {
            min: gl.NEAREST,
            mag: gl.NEAREST,
            target: gl.TEXTURE_2D_ARRAY,
            src: texturePath,
        })

        this.uniforms.u_sun = isSun ? 1 : 0;
    }

    update(time) {
        super.update()

        const totalTrans = _.concat(this.transforms, _.filter(this.vParent.transforms, { isPriv: false } ))

        this.uniforms.u_model = _.reduceRight(totalTrans, (acc, t) => m4.multiply(acc, t.f(time)), m4.identity())
        
        
        this.uniforms.u_light_transform = _.reduce(totalTrans, (acc, t) => m4.multiply(acc, t.f(-time)), m4.identity())

        this.uniforms.u_modelView = m4.multiply( this.uniforms.u_view, this.uniforms.u_model )
        this.uniforms.u_normalMat = m4.transpose( this.uniforms.u_modelView ) 
    }
    
    render(gl, changeProg) {
        super.render(gl, changeProg)
    }
}

export default Planet