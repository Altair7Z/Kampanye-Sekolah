// js/chart.js
// Merender grafik berdasarkan data dari data-perilaku-energi.js

document.addEventListener('DOMContentLoaded', function() {
    
    // Pastikan library Chart.js berhasil dimuat dari CDN
    if (typeof Chart === 'undefined') {
        console.error("Gagal memuat Chart.js. Cek koneksi internet atau CDN.");
        return;
    }

    // Pastikan data dan canvas ada
    if (typeof DATA_ENERGI === 'undefined') {
        console.error("Data DATA_ENERGI tidak ditemukan. Pastikan file js/data-perilaku-energi.js diload dengan benar.");
        return;
    }

    const canvasIds = ['chartSebaran', 'chartJurusan', 'chartGaya', 'chartButir'];
    const canvasAda = canvasIds.every(id => document.getElementById(id));
    if (!canvasAda) {
        console.error("Elemen canvas tidak ditemukan di HTML.");
        return;
    }

    try {
        // --- 1. Chart Sebaran Skor Total (Bar Chart) ---
        const ctxSebaran = document.getElementById('chartSebaran').getContext('2d');
        const labelsSebaran = DATA_ENERGI.sebaran_skor_total.map(item => item.skor_total);
        const dataSebaran = DATA_ENERGI.sebaran_skor_total.map(item => item.jumlah);

        new Chart(ctxSebaran, {
            type: 'bar',
            data: {
                labels: labelsSebaran,
                datasets: [{
                    label: 'Jumlah Siswa',
                    data: dataSebaran,
                    backgroundColor: '#40916C',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { title: { display: true, text: 'Total Skor (10-40)', color: '#4B5347' }, grid: { display: false } },
                    y: { title: { display: true, text: 'Jumlah Siswa', color: '#4B5347' }, beginAtZero: true }
                }
            }
        });

        // --- 2. Chart Rata-rata per Jurusan (Horizontal Bar) ---
        const ctxJurusan = document.getElementById('chartJurusan').getContext('2d');
        const sortedJurusan = [...DATA_ENERGI.per_jurusan].sort((a, b) => b.rata_rata_skor - a.rata_rata_skor);
        const labelsJurusan = sortedJurusan.map(item => item.kode);
        const dataJurusan = sortedJurusan.map(item => item.rata_rata_skor);

        new Chart(ctxJurusan, {
            type: 'bar',
            data: {
                labels: labelsJurusan,
                datasets: [{
                    label: 'Rata-rata Skor (1-4)',
                    data: dataJurusan,
                    backgroundColor: '#E4A11B',
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { min: 3.0, max: 4.0 } }
            }
        });

        // --- 3. Chart Gaya Belajar (Doughnut) ---
        const ctxGaya = document.getElementById('chartGaya').getContext('2d');
        const labelsGaya = DATA_ENERGI.per_gaya_belajar.map(item => item.gaya_belajar);
        const dataGaya = DATA_ENERGI.per_gaya_belajar.map(item => item.rata_rata_skor);

        new Chart(ctxGaya, {
            type: 'doughnut',
            data: {
                labels: labelsGaya,
                datasets: [{
                    data: dataGaya,
                    backgroundColor: ['#1B4332', '#40916C', '#E4A11B'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw + ' (Rata-rata)';
                            }
                        }
                    }
                }
            }
        });

        // --- 4. Chart Rata-rata per Butir (Bar Chart) ---
        const ctxButir = document.getElementById('chartButir').getContext('2d');
        const labelsButir = DATA_ENERGI.per_butir.map(item => item.kode);
        const dataButir = DATA_ENERGI.per_butir.map(item => item.rata_rata);
        
        const bgColorsButir = dataButir.map(val => {
            if (val >= 3.45) return '#1B4332';
            if (val <= 3.25) return '#E4A11B';
            return '#40916C';
        });

        new Chart(ctxButir, {
            type: 'bar',
            data: {
                labels: labelsButir,
                datasets: [{
                    label: 'Rata-rata Skor (1-4)',
                    data: dataButir,
                    backgroundColor: bgColorsButir,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                const index = context[0].dataIndex;
                                return DATA_ENERGI.per_butir[index].kode + ' - ' + DATA_ENERGI.per_butir[index].label;
                            }
                        }
                    }
                },
                scales: {
                    y: { min: 3.0, max: 4.0 },
                    x: { grid: { display: false } }
                }
            }
        });

        console.log("Semua chart berhasil dirender.");

    } catch (error) {
        console.error("Terjadi kesalahan saat merender chart:", error);
    }
});