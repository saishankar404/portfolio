(function() {
  let mode = "webgl"; // "webgl" or "css"
  let renderer, scene, camera, mesh, uniforms;
  let textures = [];
  let currentArtistIndex = 3; // Default starting index (Tame Impala / Sampha boundary)
  let artistsList = [];
  let isInitialized = false;

  // DOM elements for CSS fallback
  let cssLayerCurrent, cssLayerNext;
  let cssCurrentCircles = [], cssNextCircles = [];

  // WebGL Shaders
  const VertexShader = `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `;

  const FragmentShader = `
    uniform float Time;
    uniform sampler2D uTextureCurrent;
    uniform sampler2D uTextureNext;
    uniform float uBlend;

    uniform vec2 BackgroundCircleOrigin;
    uniform float BackgroundCircleRadius;

    uniform vec2 CenterCircleOrigin;
    uniform float CenterCircleRadius;

    uniform vec2 LeftCircleOrigin;
    uniform float LeftCircleRadius;

    uniform vec2 RightCircleOrigin;
    uniform float RightCircleRadius;

    const vec2 rotateCenter = vec2(0.5, 0.5);
    vec2 RotateAroundCenter(vec2 point, float angle) {
      vec2 offset = (point - rotateCenter);
      float s = sin(angle);
      float c = cos(angle);
      mat2 rotation = mat2(c, -s, s, c);
      offset = (rotation * offset);
      return (rotateCenter + offset);
    }

    void main() {
      // Clear canvas base
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);

      // 1. Background Circle (Slow counter-clockwise rotation)
      vec2 BackgroundCircleOffset = (gl_FragCoord.xy - BackgroundCircleOrigin);
      if (length(BackgroundCircleOffset) <= BackgroundCircleRadius) {
        vec2 uv = RotateAroundCenter(
          (((BackgroundCircleOffset / BackgroundCircleRadius) + 1.0) * 0.5),
          (Time * -0.25)
        );
        vec4 colCurrent = texture2D(uTextureCurrent, uv);
        vec4 colNext = texture2D(uTextureNext, uv);
        vec4 sampledColor = mix(colCurrent, colNext, uBlend);
        
        // Premultiply by alpha to prevent washed-out/grey borders
        gl_FragColor.rgb = sampledColor.rgb * sampledColor.a;
        gl_FragColor.a = 1.0;
      }

      // 2. Center Circle (Medium clockwise rotation)
      vec2 CenterCircleOffset = (gl_FragCoord.xy - CenterCircleOrigin);
      if (length(CenterCircleOffset) <= CenterCircleRadius) {
        vec2 uv = RotateAroundCenter(
          (((CenterCircleOffset / CenterCircleRadius) + 1.0) * 0.5),
          (Time * 0.5)
        );
        vec4 colCurrent = texture2D(uTextureCurrent, uv);
        vec4 colNext = texture2D(uTextureNext, uv);
        vec4 newColor = mix(colCurrent, colNext, uBlend);
        
        // Premultiply by alpha to ensure rich blending
        newColor.rgb *= newColor.a;
        newColor.a *= 0.75;

        gl_FragColor.rgb = ((newColor.rgb * newColor.a) + (gl_FragColor.rgb * (1.0 - newColor.a)));
        gl_FragColor.a = (newColor.a + (gl_FragColor.a * (1.0 - newColor.a)));
      }

      // 3. Left Circle (Fast clockwise rotation)
      vec2 LeftCircleOffset = (gl_FragCoord.xy - LeftCircleOrigin);
      if (length(LeftCircleOffset) <= LeftCircleRadius) {
        vec2 uv = RotateAroundCenter(
          (((LeftCircleOffset / LeftCircleRadius) + 1.0) * 0.5),
          (Time * 1.0)
        );
        vec4 colCurrent = texture2D(uTextureCurrent, uv);
        vec4 colNext = texture2D(uTextureNext, uv);
        vec4 newColor = mix(colCurrent, colNext, uBlend);
        
        // Premultiply by alpha to ensure rich blending
        newColor.rgb *= newColor.a;
        newColor.a *= 0.5;

        gl_FragColor.rgb = ((newColor.rgb * newColor.a) + (gl_FragColor.rgb * (1.0 - newColor.a)));
        gl_FragColor.a = (newColor.a + (gl_FragColor.a * (1.0 - newColor.a)));
      }

      // 4. Right Circle (Medium counter-clockwise rotation)
      vec2 RightCircleOffset = (gl_FragCoord.xy - RightCircleOrigin);
      if (length(RightCircleOffset) <= RightCircleRadius) {
        vec2 uv = RotateAroundCenter(
          (((RightCircleOffset / RightCircleRadius) + 1.0) * 0.5),
          (Time * -0.75)
        );
        vec4 colCurrent = texture2D(uTextureCurrent, uv);
        vec4 colNext = texture2D(uTextureNext, uv);
        vec4 newColor = mix(colCurrent, colNext, uBlend);
        
        // Premultiply by alpha to ensure rich blending
        newColor.rgb *= newColor.a;
        newColor.a *= 0.5;

        gl_FragColor.rgb = ((newColor.rgb * newColor.a) + (gl_FragColor.rgb * (1.0 - newColor.a)));
        gl_FragColor.a = (newColor.a + (gl_FragColor.a * (1.0 - newColor.a)));
      }

      // Darken the background to be atmospheric and preserve text contrast
      gl_FragColor.rgb *= 0.45;
    }
  `;

  // Process cover art image: crop, blur, and make it a Three.js texture
  function createBlurredTexture(imageSrc) {
    return new Promise((resolve) => {
      const img = new Image();
      // No crossOrigin for local images to prevent CORS issues on file:// protocol
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const blurExtent = 120; 
        const padding = blurExtent * 1.5;
        const expandedSize = size + padding;

        // Crop to a circle
        const circleCanvas = document.createElement("canvas");
        circleCanvas.width = size;
        circleCanvas.height = size;
        const circleCtx = circleCanvas.getContext("2d");

        circleCtx.beginPath();
        circleCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        circleCtx.clip();
        circleCtx.drawImage(
          img,
          (img.width - size) / 2, (img.height - size) / 2,
          size, size,
          0, 0,
          size, size
        );

        // Render blurred output
        const blurredCanvas = document.createElement("canvas");
        blurredCanvas.width = expandedSize;
        blurredCanvas.height = expandedSize;
        const blurredCtx = blurredCanvas.getContext("2d");

        blurredCtx.filter = "blur(40px)";
        blurredCtx.drawImage(circleCanvas, padding / 2, padding / 2);

        // Convert to WebGL Texture
        const texture = new THREE.CanvasTexture(blurredCanvas);
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;

        resolve(texture);
      };
      img.onerror = () => {
        console.error("Failed to load album art: " + imageSrc + ". Fallback to solid texture.");
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#16161a";
        ctx.fillRect(0, 0, 256, 256);
        const texture = new THREE.CanvasTexture(canvas);
        resolve(texture);
      };
      img.src = imageSrc;
    });
  }

  // Inject required styles dynamically to avoid modifying stylesheet files
  function injectStyles() {
    const styleId = "dynamic-bg-styles-base";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      #dynamic-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1;
        pointer-events: none;
        overflow: hidden;
        background: #0d0d0f;
        transition: opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1);
      }
      #dynamic-bg canvas {
        display: block;
        width: 100% !important;
        height: 100% !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Inject styles for the CSS Fallback
  function injectStylesCSS() {
    const styleId = "dynamic-bg-styles-css";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      .bg-layer {
        position: absolute;
        inset: 0;
        opacity: 0;
        pointer-events: none;
        will-change: opacity;
        filter: blur(50px);
        transform: translate3d(0, 0, 0);
      }
      .bg-layer.active {
        opacity: 1;
      }
      .bg-circle {
        position: absolute;
        border-radius: 50%;
        background-size: cover;
        background-position: center;
        transform-origin: center center;
        will-change: transform;
      }
      .bg-circle-back {
        width: 150vmax; height: 150vmax;
        top: -25vmax; left: -25vmax;
        animation: rotateCCW 65s linear infinite;
        opacity: 0.14;
      }
      .bg-circle-center {
        width: 90vmax; height: 90vmax;
        top: 5vh; left: 5vw;
        animation: rotateCW 48s linear infinite;
        opacity: 0.16;
      }
      .bg-circle-left {
        width: 70vmax; height: 70vmax;
        bottom: -15vmax; left: -15vmax;
        animation: rotateCW 35s linear infinite;
        opacity: 0.1;
      }
      .bg-circle-right {
        width: 60vmax; height: 60vmax;
        top: -10vmax; right: -10vmax;
        animation: rotateCCW 38s linear infinite;
        opacity: 0.1;
      }
      @keyframes rotateCW {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes rotateCCW {
        from { transform: rotate(0deg); }
        to { transform: rotate(-360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize CSS Fallback circles
  function createCSSCircles(parent, imageSrc) {
    const classes = ["bg-circle-back", "bg-circle-center", "bg-circle-left", "bg-circle-right"];
    const circles = [];
    classes.forEach(cls => {
      const circle = document.createElement("div");
      circle.className = "bg-circle " + cls;
      circle.style.backgroundImage = `url('${imageSrc}')`;
      parent.appendChild(circle);
      circles.push(circle);
    });
    return circles;
  }

  // Fallback setup for file:// protocol or failed WebGL contexts
  function initCSSBg(artists, initialIndex) {
    mode = "css";
    artistsList = artists;
    currentArtistIndex = initialIndex;

    const bgContainer = document.getElementById("dynamic-bg");
    bgContainer.style.opacity = "0";

    injectStylesCSS();

    // Setup current display layer
    cssLayerCurrent = document.createElement("div");
    cssLayerCurrent.className = "bg-layer active";
    cssCurrentCircles = createCSSCircles(cssLayerCurrent, artists[currentArtistIndex].image);
    bgContainer.appendChild(cssLayerCurrent);

    // Setup next transition buffer layer
    cssLayerNext = document.createElement("div");
    cssLayerNext.className = "bg-layer";
    cssNextCircles = createCSSCircles(cssLayerNext, artists[currentArtistIndex].image);
    bgContainer.appendChild(cssLayerNext);

    isInitialized = true;
    bgContainer.style.opacity = "1";
  }

  // Main background initialization
  window.initDynamicBg = async function(artists, initialIndex = 3) {
    if (isInitialized) return;
    injectStyles();

    // Setup container
    let bgContainer = document.getElementById("dynamic-bg");
    if (!bgContainer) {
      bgContainer = document.createElement("div");
      bgContainer.id = "dynamic-bg";
      document.body.appendChild(bgContainer);
    }
    bgContainer.style.opacity = "0";

    // 1. Fallback immediately if file:// protocol is active to avoid tainted canvas exceptions
    const isFileProtocol = (window.location.protocol === "file:");
    if (isFileProtocol) {
      console.warn("Local file:// protocol detected. Activating GPU-accelerated CSS blur fallback background.");
      initCSSBg(artists, initialIndex);
      return;
    }

    // 2. Fallback if Three.js failed to load
    if (typeof THREE === "undefined") {
      console.warn("Three.js not loaded. Activating CSS blur fallback background.");
      initCSSBg(artists, initialIndex);
      return;
    }

    // 3. Attempt to spin up Three.js WebGL rendering
    try {
      artistsList = artists;
      currentArtistIndex = initialIndex;

      // Pre-compile all blurred textures in parallel
      const texturePromises = artists.map(a => createBlurredTexture(a.image));
      textures = await Promise.all(texturePromises);

      // Initial Three.js setup
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;

      const currentTexture = textures[currentArtistIndex] || textures[0];

      // Double buffer texture bindings and shader uniforms setup
      uniforms = {
        Time: { value: 0 },
        uTextureCurrent: { value: currentTexture },
        uTextureNext: { value: currentTexture },
        uBlend: { value: 0.0 },

        BackgroundCircleOrigin: { value: new THREE.Vector2() },
        BackgroundCircleRadius: { value: 0 },

        CenterCircleOrigin: { value: new THREE.Vector2() },
        CenterCircleRadius: { value: 0 },

        LeftCircleOrigin: { value: new THREE.Vector2() },
        LeftCircleRadius: { value: 0 },

        RightCircleOrigin: { value: new THREE.Vector2() },
        RightCircleRadius: { value: 0 }
      };

      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: VertexShader,
        fragmentShader: FragmentShader,
        transparent: true
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      renderer.setPixelRatio(Math.min(1.2, window.devicePixelRatio || 1));
      bgContainer.appendChild(renderer.domElement);

      // Responsive scaling loop
      function updateDimensions() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);

        const scaledWidth = width * (window.devicePixelRatio || 1);
        const scaledHeight = height * (window.devicePixelRatio || 1);

        const largestAxis = (scaledWidth > scaledHeight) ? "X" : "Y";
        const largestAxisSize = (scaledWidth > scaledHeight) ? scaledWidth : scaledHeight;

        uniforms.BackgroundCircleOrigin.value.set(scaledWidth / 2, scaledHeight / 2);
        uniforms.BackgroundCircleRadius.value = largestAxisSize * 1.5;

        uniforms.CenterCircleOrigin.value.set(scaledWidth / 2, scaledHeight / 2);
        uniforms.CenterCircleRadius.value = largestAxisSize * ((largestAxis === "X") ? 1.0 : 0.75);

        uniforms.LeftCircleOrigin.value.set(0, scaledHeight);
        uniforms.LeftCircleRadius.value = largestAxisSize * 0.75;

        uniforms.RightCircleOrigin.value.set(scaledWidth, 0);
        uniforms.RightCircleRadius.value = largestAxisSize * ((largestAxis === "X") ? 0.65 : 0.5);
      }

      updateDimensions();
      window.addEventListener("resize", updateDimensions);

      // Animation rendering ticker
      function animate() {
        requestAnimationFrame(animate);
        uniforms.Time.value = performance.now() / 3500;
        renderer.render(scene, camera);
      }
      animate();

      mode = "webgl";
      isInitialized = true;
      bgContainer.style.opacity = "1";
    } catch (e) {
      console.warn("WebGL initialization failed. Activating CSS fallback:", e);
      if (renderer && renderer.domElement) {
        renderer.domElement.remove();
      }
      initCSSBg(artists, initialIndex);
    }
  };

  // DESKTOP: Updates background mapping animatedIndex.val (a smooth float range)
  window.updateDynamicBgDesktop = function(val) {
    if (!isInitialized || artistsList.length === 0) return;

    if (mode === "webgl") {
      const currentIdx = Math.max(0, Math.min(textures.length - 1, Math.floor(val)));
      const nextIdx = Math.max(0, Math.min(textures.length - 1, Math.ceil(val)));
      const blendFraction = val - currentIdx;

      uniforms.uTextureCurrent.value = textures[currentIdx];
      uniforms.uTextureNext.value = textures[nextIdx];
      uniforms.uBlend.value = blendFraction;
    } else {
      // CSS Fallback Transition
      const currentIdx = Math.max(0, Math.min(artistsList.length - 1, Math.floor(val)));
      const nextIdx = Math.max(0, Math.min(artistsList.length - 1, Math.ceil(val)));
      const blendFraction = val - currentIdx;

      // Update background images for both overlapping layers
      cssCurrentCircles.forEach(circle => {
        circle.style.backgroundImage = `url('${artistsList[currentIdx].image}')`;
      });
      cssNextCircles.forEach(circle => {
        circle.style.backgroundImage = `url('${artistsList[nextIdx].image}')`;
      });

      // Linear crossfade of container layers
      cssLayerCurrent.style.opacity = 1.0 - blendFraction;
      cssLayerNext.style.opacity = blendFraction;
    }

    currentArtistIndex = Math.round(val);
  };

  // MOBILE: Cross-fades background to target index using GSAP tweening
  let mobileTransitionTween = null;
  let cssTransitionTween = null;

  window.updateDynamicBgMobile = function(targetIdx) {
    if (!isInitialized || artistsList.length === 0) return;
    if (targetIdx === currentArtistIndex) return;

    const prevIdx = currentArtistIndex;
    currentArtistIndex = targetIdx;

    if (mode === "webgl") {
      if (mobileTransitionTween) {
        mobileTransitionTween.kill();
      }

      // Set double buffers
      uniforms.uTextureCurrent.value = textures[prevIdx];
      uniforms.uTextureNext.value = textures[targetIdx];
      uniforms.uBlend.value = 0.0;

      // Animate blend to 1.0 using page's loaded GSAP library
      if (typeof gsap !== "undefined") {
        mobileTransitionTween = gsap.to(uniforms.uBlend, {
          value: 1.0,
          duration: 0.7,
          ease: "power2.out",
          onComplete: () => {
            uniforms.uTextureCurrent.value = textures[targetIdx];
            uniforms.uBlend.value = 0.0;
            mobileTransitionTween = null;
          }
        });
      } else {
        uniforms.uTextureCurrent.value = textures[targetIdx];
        uniforms.uBlend.value = 0.0;
      }
    } else {
      // CSS Fallback Transition
      if (cssTransitionTween) {
        cssTransitionTween.kill();
      }

      // Bind target image to next layer
      cssNextCircles.forEach(circle => {
        circle.style.backgroundImage = `url('${artistsList[targetIdx].image}')`;
      });

      cssLayerCurrent.style.opacity = 1.0;
      cssLayerNext.style.opacity = 0.0;

      if (typeof gsap !== "undefined") {
        const tl = gsap.timeline({
          onComplete: () => {
            // Commit transition: swap target state into current layer and reset
            cssCurrentCircles.forEach(circle => {
              circle.style.backgroundImage = `url('${artistsList[targetIdx].image}')`;
            });
            cssLayerCurrent.style.opacity = 1.0;
            cssLayerNext.style.opacity = 0.0;
            cssTransitionTween = null;
          }
        });
        tl.to(cssLayerCurrent, { opacity: 0.0, duration: 0.7, ease: "power2.out" }, 0);
        tl.to(cssLayerNext, { opacity: 1.0, duration: 0.7, ease: "power2.out" }, 0);
        cssTransitionTween = tl;
      } else {
        // Instant swap fallback
        cssCurrentCircles.forEach(circle => {
          circle.style.backgroundImage = `url('${artistsList[targetIdx].image}')`;
        });
        cssLayerCurrent.style.opacity = 1.0;
        cssLayerNext.style.opacity = 0.0;
      }
    }
  };
})();
