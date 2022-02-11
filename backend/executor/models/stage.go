package models

type Stage string

const (
	Draft           Stage = "Draft"
	Submitted       Stage = "Submitted"
	Compiling       Stage = "Compiling"
	Compile_Success Stage = "Compiled_Success"
	Compile_Failed  Stage = "Compile_Failed"
	Running         Stage = "Running"
	Run_Success     Stage = "Run_Success"
	Run_Failed      Stage = "Run_Failed"
	Unknown_Failed  Stage = "Unknown_Failed"
)
