#!/usr/bin/python3

import psutil as ps
import time
import subprocess
import sys
import statistics
import json


# define the command for the subprocess
cmd = sys.argv[1:]
print(cmd)

mem_values = list()
cpu_values = list()
dur_values = list()

with open('/data/out', 'w') as out:
    for i in range(10):

        peak_mem = 0
        peak_cpu = 0

        start = time.monotonic_ns()
        process = ps.Popen(cmd, stdout=out, stderr=subprocess.STDOUT)

        while(process.is_running()):
            time.sleep(0.001)

            mem = process.memory_info().rss/(float)(2**10)
            cpuTimes = process.cpu_times()
            cpu = cpuTimes.user + cpuTimes.system

            if mem > peak_mem:
                peak_mem = mem
            if cpu > peak_cpu:
                peak_cpu = cpu
            if mem == 0.0:
                break

        finish = time.monotonic_ns()

        mem_values.append(peak_mem)
        cpu_values.append(peak_cpu*1000)
        dur_values.append((finish - start)/1000000)

stats = {
    "duration": {
        "avg": statistics.median(dur_values),
        "values": dur_values
    },
    "mem": {
        "avg": statistics.median(mem_values),
        "values": mem_values
    },
    "cpu": {
        "avg": statistics.median(cpu_values),
        "values": cpu_values
    }
}
with open('/data/stats.json', 'w') as fp:
    json.dump(stats, fp, sort_keys=True, indent=4)
