package log

import (
	"context"

	"go.uber.org/zap"
)

var (
	logger *zap.Logger
	sugar  *zap.SugaredLogger

	TAG_KEYS = []string{"RUN_ID", "CODE_RUN_ID"}
)

func Init() func() {
	logger, _ := zap.NewProduction()
	sugar := logger.Sugar()
	return func() {
		sugar.Sync()
	}
}

func Info(ctx context.Context, message string, additionalTags ...string) {
	sugar.Info(message, getTags(ctx), additionalTags)
}

func Error(ctx context.Context, message string, additionalTags ...string) {
	sugar.Error(message, getTags(ctx), additionalTags)
}

func getTags(ctx context.Context) []string {
	tags := []string{}
	for _, k := range TAG_KEYS {
		v := ctx.Value(k)
		str, ok := v.(string)
		if ok && len(str) > 0 {
			tags = append(tags, k, str)
		}
	}
	return tags
}
