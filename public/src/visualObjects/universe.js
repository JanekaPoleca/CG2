import VisualObject from './abstract'
import {m4, resizeCanvasToDisplaySize, createBufferInfoFromArrays, createTexture} from '../../lib/twgl-full'

/**
 * Universe Class
 */
 class Universe extends VisualObject {
    
    static vs = `
    attribute vec3 positions;
    attribute vec2 texcoord;

    uniform mat4 u_p_transform;
    uniform mat4 u_worldViewProjection;

    varying vec2 tex;

    void main() {
        tex = texcoord; 
        gl_Position = vec4(positions, 1);
    }`
    static fs = `
    precision mediump float;

    uniform sampler2D u_diffuse;

    varying vec2 tex;
    
    void main()
    {
        gl_FragColor = vec4( texture2D(u_diffuse, tex).xyz, 1);
    }
    `
    
    constructor(gl) {
        super(gl)

        this.fov = 30 * Math.PI / 180
        this.zNear = 200
        this.zFar = 1000
        this.eye = [0, 0, 600]
        this.target = [0, 0, 0]
        this.up = [0, 1, 0]

        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
        const projection = m4.perspective(this.fov, aspect, this.zNear, this.zFar)
        const camera = m4.lookAt(this.eye, this.target, this.up)
        const view = m4.inverse(camera)
        
        this.uniforms.u_projection = projection
        this.uniforms.u_view = view
        
        this.uniforms.u_lightWorldPos = [0, 0, 1, 1]
        this.uniforms.u_lightColor = [1, .8, .8, 1]

        this.uniforms.u_ambientColor = [0.05, 0.02, 0.02, 1]
        this.uniforms.u_specularColor = [1, 0, 0, 1]

        this.uniforms.u_ka = 1
        this.uniforms.u_kd = 1
        this.uniforms.u_ks = 1

        this.uniforms.u_shininess = 80

        const arrays = {
            positions: [
                -1,-1, 0,
                -1,1, 0,
                1,-1, 0,
                1,1, 0
            ],
            texcoord: [0,0,2,2,0,2,2,0],
            indices: [
                0,3,1,
                0,2,3
            ]
        }

        this.bufferInfo = createBufferInfoFromArrays(gl, arrays)

        const tex = createTexture(gl, {
            min: gl.NEAREST,
            mag: gl.NEAREST,
            target: gl.TEXTURE_2D_ARRAY,
            src: './res/stars_milky.jpg',
        })

        this.uniforms.u_diffuse = tex
    }

    update() {
        super.update()
    }

    render(gl, changeProg) {
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
        const camera = m4.lookAt(this.eye, this.target, this.up)
        
        this.uniforms.u_projection = m4.perspective(this.fov, aspect, this.zNear, this.zFar)
        this.uniforms.u_viewInverse = camera

        resizeCanvasToDisplaySize(gl.canvas)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        super.render(gl, changeProg)
        gl.clear(gl.DEPTH_BUFFER_BIT)    
    }
}

export default Universe
