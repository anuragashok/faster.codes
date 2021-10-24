gcloud auth login
gcloud container clusters get-credentials faster-codes-backend --zone us-central1-a --project faster-codes-backend
cp ~/.kube/config /kubeconfig/config
yarn start:dev
