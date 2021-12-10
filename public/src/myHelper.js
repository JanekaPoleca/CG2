/**
 * VisualObject Abstract Class
 */
class VisualObject {

    constructor(gl, parent) {
        let cl = this.constructor
        if ( cl === VisualObject ) {
            throw 'VisualObject is not instantiable'
        }
        this.parent = parent
        this.programInfo = twgl.createProgramInfo(gl, [cl.vs, cl.fs])
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
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
        twgl.setUniforms(programInfo, uniforms)
        twgl.drawBufferInfo(gl, bufferInfo)
    }
}

/**
 * Sphere Class
 */
class Sphere extends VisualObject {
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

    constructor(gl, radius, divs, parent ) {
        super(gl, parent)
        this.bufferInfo = twgl.primitives.createSphereBufferInfo(gl, radius, divs, divs)

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

    addRotationZ(alpha){
        this.transformations.push( (time) => { return m4.rotationZ(degreesToRad(alpha)*time)});
    }


}

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
        twgl.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}

const degreesToRad = deg => {
    return deg*Math.PI/180;
}