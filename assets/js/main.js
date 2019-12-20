$(document).ready(function() {

    var url = "https://my-json-server.typicode.com/luqmanulhakimdev/learn-pwa-api/members";

    var results = "";
    var deptResults = "";
    var departements = [];

    function renderPage(data) {
        $.each(data, function(key, items) {

            _dept = items.department

            results += `
                <div>
                    <h4>${items.name}</h4>
                    <p>Email: ${items.email} - Department: ${items.department}</p>
                    <p>Gender: ${items.gender}</p>
                </div>
            `;

            if($.inArray(_dept, departements) == -1) {
                departements.push(_dept);
                deptResults += `<option value="${_dept}">${_dept}</option>`;
            }

        });

        $("#members").html(results);
        $("#dept_select").html(`<option value="all">semua</option>${deptResults}`);
    }

    var networkDataReceived = false;

    // Fresh data from online
    var networkUpdate = fetch(url).then(function(response) {
        return response.json()
    }).then(function(data) {
        networkDataReceived = true;
        renderPage(data);
    });

    // Return data from cache
    caches.match(url).then(function(response) {
        if(!response) throw Error('No data on chache');
        return response.json();
    }).then(function(data) {
        if(!networkDataReceived) {
            renderPage(data);
            console.log('Render data from cache');
        }
    }).catch(function() {
        return networkUpdate;
    });

    // Fungsi Filter
    $("#dept_select").on("change", function() {
        updateMembers($(this).val())
    });

    function updateMembers(dept) {
        
        var results = "";
        var newUrl = url;

        if(dept != 'all')
            newUrl = `${url}?department=${dept}`;

        $.get(newUrl, function(data) {
            $.each(data, function(key, items) {
                _dept = items.department
                results += `
                    <div>
                        <h4>${items.name}</h4>
                        <p>Email: ${items.email} - Department: ${items.department}</p>
                        <p>Gender: ${items.gender}</p>
                    </div>
                `;
            });

            $("#members").html(results);
        });
    }

});

// PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./serviceworker.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}