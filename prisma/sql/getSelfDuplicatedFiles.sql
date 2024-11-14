SELECT f1.hash, json_agg(DISTINCT f1.id) as "fileIds"
FROM public."File" f1
JOIN public."File" f2 on f1.hash = f2.hash
WHERE f1.id <> f2.id and f1."rootFolderId" = $1 and f2."rootFolderId" = $1
GROUP BY f1.hash