# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Go project (`gedoong`). Repo is currently empty — initial scaffolding not yet committed.

## Conventions (follow when adding code)

- Go module naming: `github.com/faisalaffan/gedoong`
- Standard Go project layout: `cmd/` for binaries, `internal/` for private packages, `pkg/` for shared libraries
- `go mod tidy` before committing dependency changes
- `go vet ./...` and `go build ./...` must pass before commit
