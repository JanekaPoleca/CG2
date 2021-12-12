import {m4, createProgramInfo, setBuffersAndAttributes, setUniforms, drawBufferInfo} from '../../lib/twgl-full'

/**
 * VisualObject Interface Class
 */
class VisualObject {

    constructor(gl, parent) {
        let cl = this.constructor
        if ( cl === VisualObject ) {
            throw 'VisualObject is not instantiable'
        }
        this.parent = parent
        this.programInfo = createProgramInfo(gl, [cl.vs, cl.fs])
        this.uniforms = {}
    }

    update() {
        if (this.parent) {
            this.uniforms = {...this.uniforms, ...this.parent.uniforms}
        }
    }

    render(gl, time) {
        const {programInfo, bufferInfo, uniforms} = this

        if (!programInfo) {
            throw 'No Program so it cant render'
        }

        if(this.parent){
            this.uniforms.u_transform = m4.multiply(this.uniforms.u_transform, this.parent.uniforms.u_transform);
        }

        //TODO: ver se da para nao substituir o programa quando se da render a dois objetos do mesmo tipo
        gl.useProgram(programInfo.program)
        setBuffersAndAttributes(gl, programInfo, bufferInfo)
        setUniforms(programInfo, uniforms)
        drawBufferInfo(gl, bufferInfo)
    }
}

export default VisualObject