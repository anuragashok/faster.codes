FROM gitpod/workspace-full

### Terraform ###
RUN sudo apt-get update && \
    sudo apt-get install -y gnupg software-properties-common curl && \
    curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add - && \
    sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main" && \
    sudo apt-get update && sudo apt-get install terraform 

### Google Cloud ###
ARG GCS_DIR=/opt/google-cloud-sdk
ENV PATH=$GCS_DIR/bin:$PATH
RUN sudo chown gitpod: /opt \
    && mkdir $GCS_DIR \
    && curl -fsSL https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-344.0.0-linux-x86_64.tar.gz \
    | tar -xzvC /opt \
    && /opt/google-cloud-sdk/install.sh --quiet --usage-reporting=false --bash-completion=true
RUN gcloud --quiet components install kubectl  
    
#custom setup 
RUN sudo mkdir /data \
    && sudo mkdir /kubeconfig \
    && sudo chmod -R 777 /data \
    && sudo chmod -R 777 /kubeconfig \
    && mkdir ~/.kube

#----- local user
USER gitpod
RUN npm i @cloudflare/wrangler -g  

COPY .zshrc /tmp/
RUN cat /tmp/.zshrc >> ~/.zshrc

ENV SHELL=zsh
ENV ZSH_THEME cloud
RUN wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh || true
CMD [ "zsh" ]
