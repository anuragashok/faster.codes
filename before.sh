# commands to run in before section of .gitpod.yml
git config pull.rebase true
alias rebase="git pull origin main:main && git rebase main"