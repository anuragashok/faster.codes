
# faster.codes

[faster.codes](https://faster.codes) is an online platform that compares the runtime performance stats of code.
The platform runs two blocks of code and generates a comparison report of their runtime, CPU and memory stats. 
It further saves the result and generates a shareable permalink for the results.

Example: wondering if it's better to loop using a for-loop or parallel stream in java? check out [here](https://faster.codes/?runId=31n1)

### Components and Design considerations

 - front-end/web
	 - A jamstack front-end created by leveraging next.js's [static html export](https://nextjs.org/docs/advanced-features/static-html-export).
	 - Deployed on the edge using [Cloudflare Pages](https://pages.cloudflare.com/) 
 - api
	 - This api orchestrates all the activities and stores code run results. 
	 - Developed using typescript and deployed as serverless code instantly across the globe using [Cloudflare Workers](https://workers.cloudflare.com/)
	 - It uses [Cloudflare Durable Objects](https://developers.cloudflare.com/workers/learning/using-durable-objects) to generate unique keys and store transactional data for code runs in progress.
	 - Once code runs are complete, the data for the run becomes read-only and we no longer need the global uniqueness or transaction guarantees of Durable objects. Hence the data is moved to the global, low-latency [Cloudflare KV](https://developers.cloudflare.com/workers/learning/how-kv-works).
	 - The use of Cloudflare workers, durable objects and KV greatly reduces the scope of the backend systems. The backend system is only required for run operations and read operations can be entirely served from Cloudflare's edge network.
	 - Since the platform expects read operations to outweigh run operations by a huge margin, this leads to considerable savings in platform running costs. 
 - runner-api
	 - The runner api is used to spawn a new runner job on [GKE](https://cloud.google.com/kubernetes-engine) for each code run.
	 - On completion, the statistics gathered are updated to durable objects using the workers api mentioned above.
 - runner
	 - The runner is a set of custom docker images for different programming languages the platform supports. 
	 - A python script is added as an entrypoint to the custom images. It's a simple script that uses the wonderful [psutil](https://github.com/giampaolo/psutil) library. It compiles and executes the code blocks and reports back the statistics of the runs.
