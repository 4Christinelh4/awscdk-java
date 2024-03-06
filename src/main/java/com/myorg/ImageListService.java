package com.myorg;

import software.constructs.Construct;

import java.util.HashMap;

import software.amazon.awscdk.services.apigateway.LambdaIntegration;
import software.amazon.awscdk.services.apigateway.RestApi;
import software.amazon.awscdk.services.lambda.Code;
import software.amazon.awscdk.services.lambda.Function;
import software.amazon.awscdk.services.lambda.Runtime;

public class ImageListService extends Construct {

    @SuppressWarnings("serial")
    public ImageListService(Construct scope, String id) {
        super(scope, id);

        Function myHandler  = Function.Builder.create(this , "imagesHandler")
                .runtime(Runtime.NODEJS_18_X)
                .code(Code.fromAsset("resources"))
                .handler("imageutils.handler")
                .build();

        RestApi api = RestApi.Builder.create(this, "Imagelisting-API")
                .restApiName("EC2 image Service").description("This service services EC2.")
                .build();

        HashMap<String, String> m = new HashMap<>();
        m.put("application/json", "{ \"statusCode\": \"200\" }");
        

        LambdaIntegration getIntegration = LambdaIntegration.Builder.create(myHandler) 
                .requestTemplates(m)
                .build();

        api.getRoot().addMethod("GET", getIntegration);    
    }

}