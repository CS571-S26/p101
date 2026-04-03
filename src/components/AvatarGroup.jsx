function AvatarGroup({ members = [], max = 3, size = 32 }) {
  const visible = members.slice(0, max);
  const remaining = members.length - max;

  return (
    <div className="avatar-group" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
      {remaining > 0 && (
        <span
          className="avatar-circle avatar-more"
          style={{ width: size, height: size, fontSize: size * 0.38 }}
        >
          +{remaining}
        </span>
      )}
      {[...visible].reverse().map((m, i) => (
        <span
          key={i}
          className="avatar-circle"
          style={{
            width: size,
            height: size,
            fontSize: size * 0.4,
            backgroundColor: m.color || '#f97316',
          }}
        >
          {m.name.charAt(0).toUpperCase()}
        </span>
      ))}
    </div>
  );
}

export default AvatarGroup;