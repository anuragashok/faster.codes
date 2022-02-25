FROM gitpod/workspace-full

# terraform
RUN sudo apt-get update && \
    sudo apt-get install -y gnupg software-properties-common curl && \
    curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add - && \
    sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main" && \
    sudo apt-get update && sudo apt-get install terraform 

# tools
RUN brew install kubectl
RUN brew install doctl
RUN sudo npm i @cloudflare/wrangler -g
RUN sudo mkdir /data

# local user
USER gitpod

RUN wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh || true
ENV SHELL=zsh
ENV ZSH_THEME cloud
COPY .zshrc /tmp/
RUN cat /tmp/.zshrc >> ~/.zshrc

CMD [ "zsh" ]
