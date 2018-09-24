rps=3
interval=$(expr 1 / "$rps")
while true; do
    while read line; do
        echo "$line" > /dev/udp/0.0.0.0/8000
        sleep "$interval"
    done < sample_stats.txt
done
