sdkConfig, err := config.LoadDefaultConfig(ctx)
if err != nil {
	log.Fatalf("Couldn't load default configuration. Here's why: %v", err)
	return
}

// Create S3 service client
svc := s3.NewFromConfig(sdkConfig, func(o *s3.Options) {
	o.BaseEndpoint = aws.String("https://fly.storage.tigris.dev")
	o.Region = "auto"
	// highlight-start
	o.UsePathStyle = false
	// highlight-end
})