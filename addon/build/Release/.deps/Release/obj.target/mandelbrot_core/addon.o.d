cmd_Release/obj.target/mandelbrot_core/addon.o := cc -o Release/obj.target/mandelbrot_core/addon.o ../addon.c '-DNODE_GYP_MODULE_NAME=mandelbrot_core' '-DUSING_UV_SHARED=1' '-DUSING_V8_SHARED=1' '-DV8_DEPRECATION_WARNINGS=1' '-DV8_DEPRECATION_WARNINGS' '-DV8_IMMINENT_DEPRECATION_WARNINGS' '-D_LARGEFILE_SOURCE' '-D_FILE_OFFSET_BITS=64' '-D__STDC_FORMAT_MACROS' '-DOPENSSL_NO_PINSHARED' '-DOPENSSL_THREADS' '-DBUILDING_NODE_EXTENSION' -I/home/yutaro/.cache/node-gyp/14.15.5/include/node -I/home/yutaro/.cache/node-gyp/14.15.5/src -I/home/yutaro/.cache/node-gyp/14.15.5/deps/openssl/config -I/home/yutaro/.cache/node-gyp/14.15.5/deps/openssl/openssl/include -I/home/yutaro/.cache/node-gyp/14.15.5/deps/uv/include -I/home/yutaro/.cache/node-gyp/14.15.5/deps/zlib -I/home/yutaro/.cache/node-gyp/14.15.5/deps/v8/include  -fPIC -pthread -Wall -Wextra -Wno-unused-parameter -m64 -O3 -fno-omit-frame-pointer  -MMD -MF ./Release/.deps/Release/obj.target/mandelbrot_core/addon.o.d.raw   -c
Release/obj.target/mandelbrot_core/addon.o: ../addon.c ../addon.h \
 /home/yutaro/.cache/node-gyp/14.15.5/include/node/js_native_api.h \
 /home/yutaro/.cache/node-gyp/14.15.5/include/node/js_native_api_types.h
../addon.c:
../addon.h:
/home/yutaro/.cache/node-gyp/14.15.5/include/node/js_native_api.h:
/home/yutaro/.cache/node-gyp/14.15.5/include/node/js_native_api_types.h:
