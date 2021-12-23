precision mediump float;

    uniform float u_ka;   // Ambient reflection coefficient
    uniform float u_kd;   // Diffuse reflection coefficient
    uniform float u_ks;   // Specular reflection coefficient

    uniform float u_shininess; 
    
    uniform vec4 u_ambientColor;
    uniform sampler2D u_diffuse;
    uniform vec4 u_specularColor;
    uniform mat4 u_view;
    uniform vec3 u_lightWorldPos; // Light position
    uniform vec4 u_lightColor;

    varying vec3 normalInterp;  // Surface normal
    varying vec3 vertPos;       // Vertex position
    varying vec2 tex;

    void main() {

        vec4 diffuseColor = texture2D(u_diffuse, tex);

        vec3 N = normalize(normalInterp);
        vec3 L = normalize( u_lightWorldPos - vertPos );

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
        vec4 diff = u_kd * (lambertian * diffuseColor);
        vec4 spec = u_ks * specular * u_specularColor;

        gl_FragColor = ambi + diff + spec;
    }