FROM gitpod/workspace-full

### Terraform ###
RUN sudo apt-get update && \
    sudo apt-get install -y gnupg software-properties-common curl && \
    curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add - && \
    sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main" && \
    sudo apt-get update && sudo apt-get install terraform 

#custom setup 
RUN brew install kubectl
RUN brew install doctl
RUN sudo mkdir /data

#----- local user
USER gitpod
RUN npm i @cloudflare/wrangler -g  

ENV SHELL=zsh
ENV ZSH_THEME cloud
RUN wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh || true
COPY .zshrc /tmp/
RUN cat /tmp/.zshrc >> ~/.zshrc
CMD [ "zsh" ]
