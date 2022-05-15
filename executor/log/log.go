package log

import (
	"context"
	"encoding/json"
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var (
	logger *zap.Logger
	sugar  *zap.SugaredLogger

	//tags
	RUN_ID string = "run_id"
	CODE_RUN_ID string = "code_run_id"

	TAG_KEYS = []string{RUN_ID,CODE_RUN_ID}
)

func Init() func() {
	atom := zap.NewAtomicLevel()
	encoderCfg := zap.NewProductionEncoderConfig()
	encoderCfg.TimeKey = "timestamp"
	encoderCfg.EncodeTime = zapcore.ISO8601TimeEncoder
	logger = zap.New(zapcore.NewCore(
		zapcore.NewJSONEncoder(encoderCfg),
		zapcore.Lock(os.Stdout),
		atom,
	))
	sugar = logger.Sugar()
	
	return func() {
		sugar.Sync()
	}
}

func Info(ctx context.Context, message string, additionalTags ...interface{}) {
	tags := []interface{}{}
	tags = append(getTags(ctx), additionalTags...)
	sugar.Infow(message, tags)
}

func Error(ctx context.Context, err error, additionalTags ...interface{}) {
	tags := []interface{}{}
	tags = append(getTags(ctx), additionalTags...)
	sugar.Errorw(err.Error(), tags)
}

func getTags(ctx context.Context) []interface{} {
	tags := []interface{}{}
	for _, k := range TAG_KEYS {
		v := ctx.Value(k)
		str, ok := v.(string)
		if ok && len(str) > 0 {
			tags = append(tags, k, str)
		}
	}
	return tags
}

func Dump(i interface{}) string {
    s, _ := json.MarshalIndent(i, "", "\t")
    return string(s)
}