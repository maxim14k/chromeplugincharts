const parseCsv = (data) => {
    const lines = data.split("\n");
    const headers = lines[0].split(",");
    const rows = lines.slice(1);
    return rows.map(row => {
        const values = row.split(",");
        let obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index];
        });
        return obj;
    });
};

async function getCurrentTabUrl() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                resolve(tabs[0].url);
            } else {
                reject(new Error("Can not get URL"));
            }
        });
    });
}

// Get CSV data
fetch('https://raw.githubusercontent.com/maxim14k/chromeplugincharts/master/data.csv')
    .then(response => response.text())
    .then(async data => {
        const csvData = parseCsv(data);
        try {
            const currentURL = await getCurrentTabUrl();
            console.log(currentURL);
            const rowData = csvData.find(row => row.Url === currentURL);
            if(rowData) {
                console.log(rowData);
                delete rowData.Url; // delete column Url
                let groupedDataByDates = {};
                Object.keys(rowData).forEach(header => {
                    const [_, metric, day, month, year] = header.match(/(.*?)-(\d+)-(\d+)-(\d+)/) || [];
                    const date = `${day}-${month}-${year}`;
                    if (!groupedDataByDates[date]) {
                        groupedDataByDates[date] = {};
                    }
                    groupedDataByDates[date][metric] = rowData[header];
                });
                const dates = Object.keys(groupedDataByDates);

                // Adding graph
                const userCounts = dates.map(date => groupedDataByDates[date].UserCount);
                const ratings = dates.map(date => groupedDataByDates[date].Rating);
                const ratingCounts = dates.map(date => groupedDataByDates[date].RatingCount);
                const sizes = dates.map(date => groupedDataByDates[date].Size);
                // data graph
                const ctxUserCount = document.getElementById('userCountChart').getContext('2d');
                new Chart(ctxUserCount, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: 'User Count',
                            data: userCounts,
                            fill: 'origin',
                            backgroundColor: 'rgba(54, 162, 235, 0.9)',
                            borderColor: 'rgb(40, 123, 178)'
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                ticks: {
                                    color: 'rgb(177, 177, 177)', // color to X
                                    font: {
                                        family: 'DM Sans, sans-serif'
                                    }
                                }
                            },
                            y: {
                                ticks: {
                                    color: 'rgb(177, 177, 177)', // color to Y
                                    font: {
                                        family: 'DM Sans, sans-serif'
                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false // turn off legend
                            }
                        }
                    }
                });

        const ctxRating = document.getElementById('ratingChart').getContext('2d');
        new Chart(ctxRating, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Rating',
                    data: ratings,
                    fill: 'origin',
                    backgroundColor: 'rgba(54, 162, 235, 0.9)',
                    borderColor: 'rgb(40, 123, 178)'
                }]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            color: 'rgb(177, 177, 177)', // color to X
                            font: {
                                family: 'DM Sans, sans-serif'
                            }
                        }
                    },
                    y: {
                        ticks: {
                            color: 'rgb(177, 177, 177)', // color to Y
                            font: {
                                family: 'DM Sans, sans-serif'
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false // turn off legend
                    }
                }
            }
        });

        const ctxRatingCount = document.getElementById('ratingCountChart').getContext('2d');
        new Chart(ctxRatingCount, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Rating Count',
                    data: ratingCounts,
                    fill: 'origin',
                    backgroundColor: 'rgba(54, 162, 235, 0.9)',
                    borderColor: 'rgb(40, 123, 178)'
                }]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            color: 'rgb(177, 177, 177)', // color to X
                            font: {
                                family: 'DM Sans, sans-serif'
                            }
                        }
                    },
                    y: {
                        ticks: {
                            color: 'rgb(177, 177, 177)', // color to Y
                            font: {
                                family: 'DM Sans, sans-serif'
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false // turn off legend
                    }
                }
            }
        });

        const ctxSize = document.getElementById('sizeChart').getContext('2d');
        new Chart(ctxSize, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Size',
                    data: sizes,
                    fill: 'origin',
                    backgroundColor: 'rgba(54, 162, 235, 0.9)',
                    borderColor: 'rgb(40, 123, 178)'
                }]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            color: 'rgb(177, 177, 177)', // color to X
                            font: {
                                family: 'DM Sans, sans-serif'
                            }
                        }
                    },
                    y: {
                        ticks: {
                            color: 'rgb(177, 177, 177)', // color to Y
                            font: {
                                family: 'DM Sans, sans-serif'
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false // turn off legend
                    }
                }
            }
        });



            } else {
                console.log("URL not found csvData");
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    })
    .catch(error => {
        console.error("Error reading CSV:", error);
    });
