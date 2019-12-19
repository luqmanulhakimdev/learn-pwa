$(document).ready(function() {

    var url = "https://my-json-server.typicode.com/luqmanulhakimdev/learn-pwa-api/members";

    var results = "";
    var deptResults = "";
    var departements = [];

    $.get(url, function(data) {

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

    });

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