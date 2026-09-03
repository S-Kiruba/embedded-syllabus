'use strict';
/* Windows desktop toast, no PowerShell modules required — drives the WinRT
   toast API directly. Falls back to a tray balloon if WinRT is unavailable
   (older builds, locked-down sessions). */
const { execFile } = require('node:child_process');

// Both are needed: loading ToastNotificationManager alone leaves XmlDocument unresolvable.
const LOAD_WINRT = [
  '[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType=WindowsRuntime] | Out-Null',
  '[Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType=WindowsRuntime] | Out-Null',
].join('\n');

// Tried in order; the classic PowerShell id is registered on every Windows install.
const APP_IDS = [
  '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\\WindowsPowerShell\\v1.0\\powershell.exe',
  'Microsoft.Windows.Explorer',
];

const psQuote = (s) => "'" + String(s == null ? '' : s).replace(/'/g, "''") + "'";
const xmlEscape = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function script(title, body) {
  return [
    '$ErrorActionPreference = "Stop"',
    '$title = ' + psQuote(xmlEscape(title)),
    '$body  = ' + psQuote(xmlEscape(body)),
    '$ids = @(' + APP_IDS.map((i) => psQuote(i)).join(', ') + ')',
    'try {',
    LOAD_WINRT,
    '  $template = "<toast><visual><binding template=""ToastGeneric"">" +',
    '    "<text>$title</text><text>$body</text>" +',
    '    "</binding></visual><audio src=""ms-winsoundevent:Notification.Reminder""/></toast>"',
    '  $sent = $false',
    '  foreach ($id in $ids) {',
    '    if ($sent) { continue }',
    '    try {',
    '      $xml = New-Object Windows.Data.Xml.Dom.XmlDocument',
    '      $xml.LoadXml($template)',
    '      $toast = New-Object Windows.UI.Notifications.ToastNotification $xml',
    '      [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($id).Show($toast)',
    '      $sent = $true',
    '      Write-Output "toast"',
    '    } catch { }',
    '  }',
    '  if (-not $sent) { throw "no notifier accepted the toast" }',
    '} catch {',
    '  Add-Type -AssemblyName System.Windows.Forms',
    '  Add-Type -AssemblyName System.Drawing',
    '  $n = New-Object System.Windows.Forms.NotifyIcon',
    '  $n.Icon = [System.Drawing.SystemIcons]::Information',
    '  $n.BalloonTipTitle = ' + psQuote(title),
    '  $n.BalloonTipText  = ' + psQuote(body),
    '  $n.Visible = $true',
    '  $n.ShowBalloonTip(15000)',
    '  Start-Sleep -Milliseconds 6000',
    '  $n.Dispose()',
    '  Write-Output "balloon"',
    '}',
  ].join('\n');
}

function notify(title, body) {
  return new Promise((resolve, reject) => {
    if (process.platform !== 'win32') return reject(new Error('Desktop toasts need Windows.'));
    execFile('powershell.exe',
      ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', script(title, body)],
      { timeout: 25000, windowsHide: true },
      (err, stdout, stderr) => {
        if (err) return reject(new Error('Toast failed: ' + String(stderr || err.message).split('\n')[0].trim()));
        resolve({ via: (String(stdout).trim().split(/\s+/)[0]) || 'toast' });
      });
  });
}

module.exports = { notify };
