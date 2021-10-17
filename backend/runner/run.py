#!/usr/bin/python3

import psutil as ps
import time
from subprocess import PIPE
import sys

# define the command for the subprocess
cmd = sys.argv[1:]
print(cmd)

mem_hist = list()
cpu_hist = list()
dur_hist = list()

for i in range(10):

    peak_mem = 0
    peak_cpu = 0

    # Create the process
    start = time.monotonic_ns()
    process = ps.Popen(cmd, stdout=PIPE)

    # while the process is running calculate resource utilization.
    while(process.is_running()):
        # set the sleep time to monitor at an interval of every second.
        time.sleep(0.001)

        # capture the memory and cpu utilization at an instance
        mem = process.memory_info().rss/(float)(2**10)
        cpu = process.cpu_percent()

        # track the peak utilization of the process
        if mem > peak_mem:
            peak_mem = mem
        if cpu > peak_cpu:
            peak_cpu = cpu
        if mem == 0.0:
            break

    finish=time.monotonic_ns()
    mem_hist.append(str(peak_mem))
    cpu_hist.append(str(peak_cpu))
    dur_hist.append(str((finish -  start)/1000000))

print("mem_hist={}".format(";".join(mem_hist)))
print("cpu_hist={}".format(";".join(cpu_hist)))
print("dur_hist={}".format(";".join(dur_hist)))
