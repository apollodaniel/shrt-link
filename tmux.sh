#!/bin/bash

SESSION="shrt_link"

# try attaching before
tmux attach-session -t $SESSION
RESULT=$?

if [[ $RESULT -gt 0 ]]; then
	tmux new-session -d -t $SESSION

	tmux send-keys "nvim" C-m

	tmux new-window
	tmux select-window 1

	tmux send-keys "bun dev" C-m

	tmux select-window 0
	tmux attach-session -t $SESSION
fi
