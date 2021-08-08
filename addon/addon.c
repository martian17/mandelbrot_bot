#include "addon.h"
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <math.h>

#define NAPI_CALL(env, call)                                              \
    do {                                                                  \
        napi_status status = (call);                                      \
        if (status != napi_ok) {                                          \
            const napi_extended_error_info* error_info = NULL;            \
            napi_get_last_error_info((env), &error_info);                 \
            bool is_pending;                                              \
            napi_is_exception_pending((env), &is_pending);                \
            if (!is_pending) {                                            \
                const char* message = (error_info->error_message == NULL) \
                    ? "empty error message"                               \
                    : error_info->error_message;                          \
                napi_throw_error((env), NULL, message);                   \
                return NULL;                                              \
            }                                                             \
        }                                                                 \
    } while(0)


//colors
int8_t red(int j){
    return (int8_t)floor(sin((double)j/100)*255);
};
int8_t gre(int j){
    return (int8_t)floor(sin((double)j/100+1)*255);
};
int8_t blu(int j){
    return (int8_t)floor(sin((double)j/100+2)*255);
};
int8_t alp(int j){
    return 255;
};



//the main code
//just using double for now, not __float128
int8_t* getImage(double real, double imag, double zoom, int itr, int width, int height, size_t * buffsize){
    //need to convert 'em to double for type consistency
    double dw = (double) width;
    double dh = (double) height;
    *buffsize = sizeof(int8_t)*width*height*4;
    int8_t* buffer = malloc(*buffsize);
    printf("got the input [%f, %f] %f %d | %dx%d",real,imag,zoom,itr,width,height);
    for(int y = 0; y < height; y++){//coords on the image buffer
        for(int x = 0; x < width; x++){
            int idx = (y*width+x)*4;
            double rr = (x-dw/2)*zoom+coord[0];//real
            double ii = (y-dh/2)*zoom+coord[1];//imaginary
            double zr = 0;
            double zi = 0;
            //let zr1,zi1;
            int j = 0;
            for(j = 0; j < itr; j++){
                double zr1 = zr*zr-zi*zi+rr;
                double zi1 = 2*zr*zi+ii;
                if(zr1*zr1+zi1*zi1>4){//absolute value greater than 2 does not belong
                    break;
                }
                zr = zr1;
                zi = zi1;
            }
            //j is the number of iterations
            //therefore j becomes the standard for deciding the color
            if(j == itr){
                buffer[idx+0] = 0;
                buffer[idx+1] = 0;
                buffer[idx+2] = 0;
                buffer[idx+3] = 255;
            }else{
                buffer[idx+0] = red(j);
                buffer[idx+1] = gre(j);
                buffer[idx+2] = blu(j);
                buffer[idx+3] = alp(j);
            }
        }
    }
    printf("image generation done");
    return buffer;
    //conversion from plain buffer to png, which is yet to be implemented
    //ctx.putImageData(imageData,0,0);
    //returns a buffer
    //return canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE });
};




static napi_value
getImage_wrapper(napi_env env, napi_callback_info info) {
    size_t argc = 6;
    napi_value argv[6];
    napi_status status;
    status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
    // Do something useful.
    //preparing the arguments
    double real;
    double imag;
    double zoom;
    int32_t itr;
    int32_t width;
    int32_t height;
    
    napi_status napi_get_value_double(env,argv[0],&real);
    napi_status napi_get_value_double(env,argv[1],&imag);
    napi_status napi_get_value_double(env,argv[2],&zoom);
    napi_status napi_get_value_int32 (env,argv[3],&itr);
    napi_status napi_get_value_int32 (env,argv[4],&width);
    napi_status napi_get_value_int32 (env,argv[5],&height);
    size_t buffsize;
    int8_t* buff = getImage(real, imag, zoom, (int)itr, (int)width, (int)height, &buffsize);
    printf("computation done\n");
    
    napi_value result;
    napi_create_arraybuffer(env, buffsize, buff, &result);
    return result;
    
    /*
    int32_t val = 1234;
    napi_value rrr;
    napi_create_int32(env, val, &rrr);
    //double * a = malloc(sizeof(double));
    //printf("got%d\n",*a);
    //napi_value b = (a);
    return rrr;
    */
}

napi_value create_addon(napi_env env) {
    napi_value result;
    NAPI_CALL(env, napi_create_object(env, &result));

    napi_value exported_function;
    NAPI_CALL(env, napi_create_function(env,"getImage",NAPI_AUTO_LENGTH,getImage_wrapper,NULL,&exported_function));

    NAPI_CALL(env, napi_set_named_property(env,result,"getImage",exported_function));

    /*NAPI_CALL(env, napi_set_named_property(env, result,"testprop",3.1419999));*/

    return result;
}