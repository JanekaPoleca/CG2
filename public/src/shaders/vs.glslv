attribute vec3 position;
attribute vec3 normal;
attribute vec2 texcoord;

uniform mat4 u_projection, u_modelView, u_normalMat;

uniform mat4 u_transform;

varying vec3 normalInterp;
varying vec3 vertPos;
varying vec2 tex;

void main() {
    tex = texcoord;
    vec4 vertPos4 = u_modelView * vec4(position, 1.0);
    vertPos = vec3(vertPos4) / vertPos4.w;
    normalInterp = vec3(u_normalMat * vec4(normal, 0.0));
    gl_Position = u_projection * vertPos4;
}