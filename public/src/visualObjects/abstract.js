import {m4, createProgramInfo, setBuffersAndAttributes, setUniforms, drawBufferInfo} from '../../lib/twgl-full'
import '../../lib/lodash'

/**
 * VisualObject Interface Class
 */
class VisualObject {

    constructor(gl, vParent) {
        let cl = this.constructor
        if ( cl === VisualObject ) {
            throw 'VisualObject is not instantiable'
        }
        this.vParent = vParent
        this.programInfo = createProgramInfo(gl, [cl.vs, cl.fs])
        this.uniforms = { u_model: m4.identity() }
        this.transforms = []
    }

    update() {
        let {uniforms, vParent} = this
        if (vParent) {
            this.uniforms = {...vParent.uniforms, ...uniforms}
        }
    }

    render(gl, changeProg = true) {
        const {programInfo, bufferInfo, uniforms} = this

        if (!programInfo) {
            throw 'No Program so it cant render'
        }

        if (changeProg) {
            gl.useProgram(programInfo.program)
            setBuffersAndAttributes(gl, programInfo, bufferInfo)
        }

        setUniforms(programInfo, uniforms)
        drawBufferInfo(gl, bufferInfo)
    }

    addTransform( trans, priv = false ) {
        this.transforms.push( { isPriv: priv, f: (time) => trans } )
    }

    addTimeTransform( func, priv = false ) {
        this.transforms.push( { isPriv: priv, f: func } )
    }
}

export default VisualObject