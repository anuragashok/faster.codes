package env

import "os"

var (
	WORKER_TOKEN = os.Getenv("WORKER_TOKEN")
	BUCKET       = os.Getenv("spaces_bucket_name")
	ACCESS_ID    = os.Getenv("spaces_access_id")
	SECRET_KEY   = os.Getenv("spaces_secret_key")
	CODE_RUN_ID  = os.Getenv("CODE_RUN_ID")
)

func ClearSensitiveEnvironmentVars() {
	// clear sensitive env vars to avoid malicious access form executor input codes
	os.Unsetenv("WORKER_TOKEN")
	os.Unsetenv("spaces_bucket_name")
	os.Unsetenv("spaces_access_id")
	os.Unsetenv("spaces_secret_key")
}
