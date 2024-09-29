provider "aws" {
    region = "us-west-2" # Set your desired AWS region
  }
  
  # IAM Role for Lambda Execution
  resource "aws_iam_role" "lambda_exec_role" {
    name = "lambda_exec_role"
  
    assume_role_policy = jsonencode({
      Version = "2012-10-17"
      Statement = [{
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }]
    })
  }
  
  # Attach IAM Policies to Lambda Role
  resource "aws_iam_role_policy" "lambda_policy" {
    role = aws_iam_role.lambda_exec_role.id
  
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Effect = "Allow"
          Action = [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
          ]
          Resource = "arn:aws:logs:us-west-2:211125628519:log-group:/aws/lambda/ocr-2:*"
        },
        {
          Effect = "Allow"
          Action = [
            "textract:AnalyzeDocument"
          ]
          Resource = "*"
        },
        {
          Effect = "Allow"
          Action = [
            "s3:GetObject",
            "s3:PutObject",
            "s3:ListBucket"
          ]
          Resource = [
            "arn:aws:s3:::splitit-visarg",
            "arn:aws:s3:::splitit-visarg/*"
          ]
        }
      ]
    })
  }
  
  # Lambda Function
  resource "aws_lambda_function" "ocr_lambda" {
    function_name = "ocr2"
    description   = "Lambda function for OCR processing"
    role          = aws_iam_role.lambda_exec_role.arn
    handler       = "lambda_function.lambda_handler"
    runtime       = "python3.12"
    memory_size   = 128
    timeout       = 60
    architectures = ["x86_64"]
  
    ephemeral_storage {
      size = 512
    }
  
    # Path to the ZIP file containing your Lambda code
    filename         = "lambda_function.zip"
    source_code_hash = filebase64sha256("lambda_function.zip")
  
    environment {
      variables = {
        # Define environment variables if required
      }
    }
  
    # Runtime management configuration
    lifecycle {
      ignore_changes = [
        "runtime"
      ]
    }
  
    # Event Invoke Configuration
    event_invoke_config {
      maximum_event_age_in_seconds = 21600
      maximum_retry_attempts       = 2
    }
  
    # Set SnapStart
    snap_start {
      apply_on = "None"
    }
  }
  
  # Lambda Permission for API Gateway Invocation
  resource "aws_lambda_permission" "allow_api_gateway_invoke" {
    statement_id  = "AllowAPIGatewayInvoke"
    action        = "lambda:InvokeFunction"
    function_name = aws_lambda_function.ocr_lambda.function_name
    principal     = "apigateway.amazonaws.com"
    source_arn    = aws_api_gateway_rest_api.api.execution_arn
  }
  
  # API Gateway
  resource "aws_api_gateway_rest_api" "api" {
    name        = "OCR_API"
    description = "API Gateway for OCR Lambda"
  }
  
  # API Gateway Resource
  resource "aws_api_gateway_resource" "api_resource" {
    rest_api_id = aws_api_gateway_rest_api.api.id
    parent_id   = aws_api_gateway_rest_api.api.root_resource_id
    path_part   = "ocr-process"
  }
  
  # API Gateway Method
  resource "aws_api_gateway_method" "api_method" {
    rest_api_id   = aws_api_gateway_rest_api.api.id
    resource_id   = aws_api_gateway_resource.api_resource.id
    http_method   = "ANY"
    authorization = "NONE"
  }
  
  # API Gateway Integration with Lambda
  resource "aws_api_gateway_integration" "lambda_integration" {
    rest_api_id             = aws_api_gateway_rest_api.api.id
    resource_id             = aws_api_gateway_resource.api_resource.id
    http_method             = aws_api_gateway_method.api_method.http_method
    integration_http_method = "POST"
    type                    = "AWS_PROXY"
    uri                     = aws_lambda_function.ocr_lambda.invoke_arn
  }
  
  # Deploy API Gateway
  resource "aws_api_gateway_deployment" "deployment" {
    depends_on  = [aws_api_gateway_integration.lambda_integration]
    rest_api_id = aws_api_gateway_rest_api.api.id
    stage_name  = "prod"
  }
  
  # Lambda Function Runtime Management Config (if needed)
  resource "aws_lambda_function_event_invoke_config" "event_invoke_config" {
    function_name                 = aws_lambda_function.ocr_lambda.arn
    maximum_retry_attempts        = 2
    maximum_event_age_in_seconds  = 21600
  }
  