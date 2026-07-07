// script.js

// 1. Common function to handle all API calls
async function callRailKit(version, endpoint, params) {
    const statusMsg = document.querySelector(`[data-status="${endpoint}"]`) || document.querySelector('.status-msg');
    const resultDiv = document.querySelector(`[data-result="${endpoint}"]`) || document.getElementById('result');
    
    // Convert params object to query string
    const queryString = new URLSearchParams(params).toString();
    
    statusMsg.innerText = "Fetching...";
    
    try {
        // Dynamic call to our server.js proxy
        const res = await fetch(`/api/proxy/${version}/${endpoint}?${queryString}`);
        const data = await res.json();
        
        statusMsg.innerText = "Success";
        resultDiv.classList.add('show');
        // Beautify output
        resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (e) {
        statusMsg.innerText = "Error: Check Console";
        console.error(e);
    }
}

// 2. Button Event Listeners
document.querySelectorAll('[data-action]').forEach(btn => {
    btn.onclick = () => {
        const action = btn.getAttribute('data-action');
        
        // Mapping buttons to their specific API requirements
        switch(action) {
            case 'pnr':
                callRailKit('v3', 'getPNRStatus', { pnrNumber: document.getElementById('pnr-input').value });
                break;
            case 'train':
                callRailKit('v1', 'getTrainSchedule', { trainNo: document.getElementById('train-input').value });
                break;
            case 'track':
                callRailKit('v1', 'liveTrainStatus', { 
                    trainNo: document.getElementById('track-train').value, 
                    startDay: 1 
                });
                break;
            case 'station':
                callRailKit('v3', 'getLiveStation', { hours: document.getElementById('station-hrs').value });
                break;
            case 'search':
                callRailKit('v3', 'trainBetweenStations', { 
                    fromStationCode: document.getElementById('search-from').value, 
                    toStationCode: document.getElementById('search-to').value 
                });
                break;
            case 'seat':
                callRailKit('v1', 'checkSeatAvailability', { 
                    trainNo: document.getElementById('seat-train').value,
                    fromStationCode: document.getElementById('seat-from').value,
                    toStationCode: document.getElementById('seat-to').value,
                    classType: document.getElementById('seat-class').value,
                    quota: document.getElementById('seat-quota').value
                });
                break;
            case 'fare':
                callRailKit('v2', 'getFare', { 
                    trainNo: document.getElementById('fare-train').value,
                    fromStationCode: document.getElementById('fare-from').value,
                    toStationCode: document.getElementById('fare-to').value
                });
                break;
        }
    };
});
        
