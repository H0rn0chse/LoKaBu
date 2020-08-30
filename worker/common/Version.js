export class Version {
    constructor (sVersion) {
        this.version = sVersion;

        const aParts = sVersion.split(".");

        this.major = parseInt(aParts[0], 10);
        this.minor = parseInt(aParts[1] || 0, 10);
        this.patch = parseInt(aParts[2] || 0, 10);
    }

    isGreater (oVersion) {
        return this.major > oVersion.major ||
        (this.major >= oVersion.major && this.minor > oVersion.minor) ||
        (this.major >= oVersion.major && this.minor >= oVersion.minor && this.patch > oVersion.patch);
    }

    isSmaller (oVersion) {
        return this.major < oVersion.major ||
        (this.major <= oVersion.major && this.minor < oVersion.minor) ||
        (this.major <= oVersion.major && this.minor <= oVersion.minor && this.patch < oVersion.patch);
    }

    isEqual (oVersion) {
        return this.major === oVersion.major && this.minor === oVersion.minor && this.patch === oVersion.patch;
    }

    equalsMajor (oVersion) {
        return this.major === oVersion.major;
    }

    toString () {
        return this.version;
    }
}
